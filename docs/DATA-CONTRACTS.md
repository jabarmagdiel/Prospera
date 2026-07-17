# Contratos de datos

## Módulo de planos

La ruta `POST /api/prospera-module/:project` acepta únicamente estas acciones:

- `getMapView`: devuelve mapa, dimensiones y marcadores.
- `loteInfo`: devuelve la ficha HTML de un lote seleccionado.
- `getMarkerInfo`, `getSearchType` y `searchMarkers`: acciones permitidas para futuras extensiones controladas.

El cliente utiliza actualmente:

```ts
type MapPayload = {
  code: number;
  data?: {
    map: {
      id: string;
      name: string;
      zoom: string;
      mapImage: { width: string; height: string };
    };
    markers: Array<{
      id: string;
      x: number;
      y: number;
      typeCssName: string;
      html: string;
    }>;
  };
};
```

La ficha de lote se normaliza a `SelectedLot`:

```ts
type SelectedLot = {
  markerId: string;
  projectName: string;
  uv: string;
  manzano: string;
  lote: string;
  surface: number;
  priceUsd: number;
  status: string;
};
```

## Datos dinámicos

Los pines y sus fichas son datos de consulta. No deben persistirse en el navegador como si fueran una reserva, ni copiarse a la página estática sin una fecha de corte y responsable de validación.

## Próxima integración CRM

El formulario de agenda todavía funciona como demo. La integración futura debe enviar únicamente los campos necesarios: proyecto, tipo de visita, nombre, WhatsApp, ubicación, objetivo, horario y fuente de campaña. Debe incorporar consentimiento y trazabilidad, sin exponer datos del CRM en el frontend.
