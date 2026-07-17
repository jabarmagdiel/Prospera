"use client";

import { useEffect, useRef, useState } from "react";
import type { Project, SelectedLot } from "../lib/types";

export function ProjectLotModule({ project, onLotSelected }: { project: Project; onLotSelected: (lot: SelectedLot) => void }) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [lotCount, setLotCount] = useState(0);
  const [availableCount, setAvailableCount] = useState(0);

  useEffect(() => {
    let disposed = false;
    let mapInstance: import("leaflet").Map | null = null;

    const statusColors: Record<string, string> = {
      Disponible: "#5e9d58",
      Vendido: "#c65442",
      Reservado: "#5276a8",
      Bloqueado: "#9b948c",
      Minuta: "#c6a63a",
    };

    function extractAttribute(html: string, attribute: string) {
      const match = html.match(new RegExp(`${attribute}=["']([^"']*)["']`, "i"));
      return match?.[1] ?? "";
    }

    function valueAfterLabel(text: string, label: string) {
      const expected = label.toLowerCase();
      const line = text.split(/\n+/).map((item) => item.trim()).find((item) => item.toLowerCase().startsWith(expected));
      if (!line) return "";
      const separator = line.indexOf(":");
      return separator >= 0 ? line.slice(separator + 1).trim() : "";
    }

    async function loadMap() {
      try {
        const response = await fetch(`/api/prospera-module/${project.systemId}?a=getMapView&u=${project.systemId}`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `id=${project.systemId}`,
        });
        if (!response.ok) throw new Error("No se pudo consultar el módulo oficial.");
        const payload = await response.json() as {
          code: number;
          data?: {
            map: { id: string; name: string; zoom: string; mapImage: { width: string; height: string } };
            markers: Array<{ id: string; x: number; y: number; typeCssName: string; html: string }>;
          };
        };
        if (payload.code !== 1 || !payload.data || disposed || !mapElementRef.current) throw new Error("El plano no devolvió información válida.");

        const L = await import("leaflet");
        if (disposed || !mapElementRef.current) return;
        const width = Number(payload.data.map.mapImage.width);
        const height = Number(payload.data.map.mapImage.height);
        let levels = 0;
        let scaledWidth = width;
        let scaledHeight = height;
        while (scaledWidth > 129 || scaledHeight > 129) {
          scaledWidth = Math.floor(scaledWidth / 2);
          scaledHeight = Math.floor(scaledHeight / 2);
          levels += 1;
        }
        levels -= 1;

        mapInstance = L.map(mapElementRef.current, {
          crs: L.CRS.Simple,
          minZoom: 18 - levels,
          maxZoom: 18,
          preferCanvas: true,
          zoomControl: true,
          attributionControl: true,
        });
        const bounds = L.latLngBounds(
          mapInstance.unproject([0, 0], 18),
          mapInstance.unproject([width, height], 18),
        );
        L.tileLayer(`https://sistema-orange.com.bo/planos/maps/campogrande/${payload.data.map.id}/map_{z}_{x}_{y}.jpg`, {
          bounds,
          noWrap: true,
          attribution: "Plano oficial Prospera · Orange Group",
        }).addTo(mapInstance);
        mapInstance.fitBounds(bounds, { padding: [10, 10] });
        mapInstance.setMaxBounds(bounds.pad(.12));

        for (const markerData of payload.data.markers) {
          const manzano = extractAttribute(markerData.html, "data-manz");
          const lote = extractAttribute(markerData.html, "data-nro");
          const color = statusColors[markerData.typeCssName] ?? "#7f776f";
          const marker = L.circleMarker(mapInstance.unproject([Number(markerData.x), Number(markerData.y)], 18), {
            radius: markerData.typeCssName === "Disponible" ? 4.5 : 3.5,
            color: "rgba(255,255,255,.82)",
            weight: 1,
            fillColor: color,
            fillOpacity: .9,
          }).addTo(mapInstance);
          marker.bindTooltip(`Mz ${manzano} · Lote ${lote}<br>${markerData.typeCssName}`, { direction: "top", sticky: true });
          marker.on("click", async () => {
            marker.setStyle({ color: "#2f2924", weight: 2, fillOpacity: 1 });
            try {
              const lotResponse = await fetch(`/api/prospera-module/${project.systemId}?a=loteInfo&u=${project.systemId}`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `id=${encodeURIComponent(markerData.id)}`,
              });
              const lotPayload = await lotResponse.json() as { code: number; data?: { info?: string } };
              const info = lotPayload.data?.info ?? "";
              const parsed = new DOMParser().parseFromString(info.replace(/<br\s*\/?\s*>/gi, "\n"), "text/html");
              const text = parsed.body.textContent?.replace(/\r/g, "") ?? "";
              const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
              const priceUsd = Number(valueAfterLabel(text, "Precio").replace(/[^0-9.,]/g, "").replace(/,/g, ""));
              const surface = Number(valueAfterLabel(text, "Superficie").replace(/[^0-9.]/g, ""));
              if (!Number.isFinite(priceUsd) || priceUsd <= 0 || !Number.isFinite(surface)) throw new Error("Ficha incompleta");
              onLotSelected({
                markerId: markerData.id,
                projectName: lines[0] || project.name,
                uv: valueAfterLabel(text, "Uv."),
                manzano: manzano || valueAfterLabel(text, "Manzano"),
                lote,
                surface,
                priceUsd,
                status: valueAfterLabel(text, "Estado") || markerData.typeCssName,
              });
            } catch {
              marker.setStyle({ color: "#fff", weight: 1 });
            }
          });
        }

        setLotCount(payload.data.markers.length);
        setAvailableCount(payload.data.markers.filter((marker) => marker.typeCssName === "Disponible").length);
        setLoaded(true);
      } catch (loadError) {
        if (!disposed) {
          setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el plano.");
          setLoaded(true);
        }
      }
    }

    void loadMap();
    return () => {
      disposed = true;
      mapInstance?.remove();
    };
  }, [project.name, project.systemId, onLotSelected]);

  return (
    <article className="lot-module-card">
      <div className="module-toolbar">
        <div><span>MÓDULO DE TERRENOS Y PLANOS</span><b>{project.name}</b></div>
        <div className="module-legend" aria-label="Estados de los lotes">
          <span><i className="available" />Disponible</span>
          <span><i className="sold" />Vendido</span>
          <span><i className="reserved" />Reservado</span>
          <span><i className="blocked" />Bloqueado</span>
          <span><i className="minute" />Minuta</span>
        </div>
      </div>
      <div className="module-frame-wrap">
        {!loaded && <div className="module-loading"><span /><b>Cargando plano y pines…</b><small>La información proviene del módulo oficial de Prospera.</small></div>}
        {error ? <div className="module-error"><b>No pudimos cargar el plano</b><p>{error}</p><small>Verificá PROSPERA_UPSTREAM_ROOT y PROSPERA_MAP_TOKEN en el entorno del servidor.</small></div> : <div ref={mapElementRef} className="lot-map" aria-label={`Plano interactivo de ${project.name}`} />}
      </div>
      <div className="module-footer">
        <p><span className="plan-dot" />{loaded && !error ? `${lotCount.toLocaleString("es-BO")} lotes cargados · ${availableCount.toLocaleString("es-BO")} disponibles` : "Elegí un pin para ver lote, superficie, precio registrado y estado."}</p>
        <div><a href={project.plan} target="_blank" rel="noreferrer">Ver plano estático ↗</a></div>
      </div>
    </article>
  );
}
