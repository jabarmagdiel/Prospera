# Prospera · Portal comercial inmobiliario

Proyecto web corporativo de Prospera con catálogo de proyectos, fichas comerciales, planos interactivos, selección de lotes, cotización al contado y simulación referencial de financiamiento.

## Alcance actual

- Portal corporativo de Prospera.
- Proyectos: La Fortuna, Campo Grande 1, Campo Grande 2 y Campo Grande 3.
- Visor de planos basado en el módulo oficial de terrenos y planos.
- Pines por estado comercial.
- Ficha de lote con UV, manzano, lote, superficie, estado y precio al contado.
- Simulador ficticio enlazado al lote seleccionado.
- Fórmula francesa contrastada con los casos de prueba documentados.
- Flujo de visita virtual o presencial.
- Centro de confianza y mensajes de compra a distancia.

La disponibilidad, los precios y las condiciones comerciales dinámicas deben confirmarse con Prospera antes de cualquier publicación o reserva.

## Requisitos

- Node.js `>=22.13.0`.
- npm.
- Para el visor dinámico, acceso de red al proxy de la aplicación y a las fuentes autorizadas de planos.

Copiá `.env.example` como `.env.local` y completá los valores del módulo interno. No subas `.env.local` ni pegues credenciales en el repositorio.

## Trabajar en VS Code

1. Abrí esta carpeta en VS Code.
2. Instalá dependencias:

   ```bash
   npm install
   ```

   Para el entorno controlado de Sites también existe `npm run install:ci`.

3. Iniciá el entorno local:

   ```bash
   npm run dev
   ```

4. Ejecutá validaciones antes de entregar cambios:

   ```bash
   npm run build
   npm test
   npm run lint
   ```

## Estructura

```text
app/                         Rutas Next/Vinext y API interna
  api/prospera-module/       Proxy de solo lectura para los módulos autorizados
components/                  Componentes visuales y flujos de interacción
  corporate-home.tsx         Portada corporativa Prospera
  project-detail.tsx         Ficha comercial de cada proyecto
  project-lot-module.tsx     Plano, pines y ficha del lote
data/                        Configuración editable de proyectos y recorridos
lib/                         Tipos compartidos y reglas financieras
public/                      Logos, favicon y planos estáticos
docs/                        Arquitectura, seguridad, despliegue y verdad comercial
tests/                       Pruebas de cálculo y renderizado
worker/                      Entrada Cloudflare/Vinext
```

## Dónde modificar cada cosa

- Nombre, `systemId`, textos, planos y datos visibles del catálogo: `data/projects.ts`.
- Tasas, rangos referenciales y fórmula: `lib/finance.ts`.
- Portada institucional: `components/corporate-home.tsx`.
- Experiencia de proyecto, plano y simulador: `components/project-detail.tsx` y `components/project-lot-module.tsx`.
- Proxy del sistema interno: `app/api/prospera-module/[project]/route.ts`.
- Estética global: `app/globals.css`.
- Logos y planos: `public/brand/` y `public/projects/`.

## Datos y seguridad

El proyecto no incluye contraseñas, sesiones, clientes, teléfonos ni exportes de CRM. La ruta de API limita los proyectos y acciones permitidos, y solo reenvía consultas de lectura al módulo autorizado. No se deben insertar credenciales en el código ni en `.env` versionados.

La guía de seguridad y el contrato de datos están en `docs/SECURITY.md` y `docs/DATA-CONTRACTS.md`.

## Despliegue

`.openai/hosting.json` conserva el `project_id` del sitio de Prospera. Para el ciclo de Sites se debe trabajar sobre la rama configurada, guardar una versión validada y desplegar únicamente esa versión. El detalle está en `docs/DEPLOYMENT.md`.

## Nota comercial

El simulador es referencial. No incluye seguros, descuentos, reserva ni conversión a bolivianos. La cotización final, el estado del lote y las condiciones de venta siempre requieren confirmación de un asesor autorizado.
