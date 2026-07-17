# Seguridad y límites de publicación

## Nunca incluir

- Usuario o contraseña del sistema interno.
- Tokens de sesión o cookies.
- Nombres, teléfonos, documentos o contratos de clientes.
- Exportes completos del CRM en `public/`.
- Claves de WhatsApp, Meta, Google Calendar, Supabase o n8n.

## Proxy de lectura

`app/api/prospera-module/[project]/route.ts` funciona como una capa intermedia para que el navegador no consuma directamente el sistema interno. La ruta:

- permite solo los proyectos `1`, `2`, `3` y `5`;
- permite solo acciones del módulo de planos;
- limita el tamaño del cuerpo recibido;
- no acepta URLs de upstream desde el cliente;
- marca las respuestas como no indexables y sin caché;
- no modifica registros del sistema interno.

El upstream y el identificador del módulo se configuran únicamente en el servidor mediante `PROSPERA_UPSTREAM_ROOT` y `PROSPERA_MAP_TOKEN`. Antes de abrir el sitio al público se debe revisar si el upstream requiere autenticación, aplicar controles de origen y sustituir ese identificador por un secreto gestionado si corresponde.

## Verdad comercial

Los rangos y tasas que aparecen en la interfaz son referenciales y deben coincidir con la matriz comercial aprobada. La disponibilidad y el precio final se confirman lote por lote. El simulador no es un contrato ni una cotización vinculante.
