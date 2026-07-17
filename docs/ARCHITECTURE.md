# Arquitectura del proyecto

## Capas

```text
Interfaz
  ├─ CorporateHome
  └─ ProjectDetail
       ├─ ProjectLotModule
       └─ simulador financiero

Configuración
  ├─ data/projects.ts
  └─ lib/finance.ts

Integración
  └─ app/api/prospera-module/[project]/route.ts
       └─ sistema interno autorizado
```

## Principios aplicados

1. La página principal solo coordina la vista seleccionada; no contiene toda la interfaz.
2. Los datos de catálogo viven en `data/projects.ts` y no se repiten en cada componente.
3. La lógica financiera está aislada en `lib/finance.ts` y tiene pruebas independientes.
4. El visor de pines está separado del detalle comercial para permitir cambiar el proveedor de mapas sin rehacer la ficha.
5. El proxy del sistema interno restringe proyectos y acciones; no se conecta desde el navegador directamente con credenciales.
6. Los datos dinámicos no se presentan como una reserva ni como una promesa de disponibilidad.

## Flujo principal

```text
Portada → seleccionar proyecto → cargar módulo de planos
       → seleccionar pin → consultar ficha de lote
       → cargar precio al contado → simular cuota
       → solicitar visita o confirmación comercial
```

## Extender a un nuevo proyecto

1. Agregar el nuevo `ProjectKey` en `lib/finance.ts`.
2. Agregar su configuración financiera aprobada.
3. Agregar la ficha en `data/projects.ts`.
4. Agregar el `systemId` al conjunto permitido de la ruta API.
5. Incorporar logo y plano estático en `public/`.
6. Agregar casos de prueba financieros y revisar el texto comercial.
7. Validar que el sistema interno entregue el mismo formato de marcadores y ficha.
