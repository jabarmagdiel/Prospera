# Datos del proyecto

La aplicación separa datos de catálogo, reglas financieras y datos dinámicos del sistema interno.

- `projects.ts`: contenido visible del portafolio y mapeo de cada proyecto al módulo oficial.
- `../lib/finance.ts`: reglas referenciales del simulador.
- Pines, estados, superficies y precios por lote: se consultan mediante la API de solo lectura.

No colocar aquí clientes, exportes de CRM ni contraseñas. Los datos privados de investigación se mantienen fuera del paquete público del sitio.
