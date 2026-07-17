"use client";

import { useEffect, useState } from "react";

export function ProjectMap({ planImage, projectId }: { planImage: string, projectId?: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-[500px] md:h-[700px] bg-stone-100 rounded-3xl animate-pulse" />;

  // Mapear los IDs del CMS a los IDs de la URL original
  // La Fortuna = 5, Campo Grande 1 = 1, Campo Grande 2 = 2, Campo Grande 3 = 3
  let mapId = "5"; // Default a La Fortuna
  if (projectId) {
    if (projectId.includes("1")) mapId = "1";
    if (projectId.includes("2")) mapId = "2";
    if (projectId.includes("3")) mapId = "3";
  }

  const iframeSrc = `/api/map-proxy?mapa=Y3Jpcw&u=${mapId}`;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full h-[500px] md:h-[700px] bg-stone-100 rounded-3xl border border-stone-200 shadow-inner z-0 overflow-hidden relative">
        <iframe
          src={iframeSrc}
          className="w-full h-full absolute inset-0 border-none"
          title="Plano del Proyecto"
        />
      </div>
    </div>
  );
}
