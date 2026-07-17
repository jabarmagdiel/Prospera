# Desarrollo y despliegue

## Desarrollo local

```bash
npm install
npm run dev
```

El entorno utiliza Vinext/Vite y la entrada Cloudflare definida en `worker/index.ts`. Los logs locales se escriben en rutas ignoradas por Git.

## Validación

```bash
npm run build
npm test
npm run lint
```

No se deben publicar cambios sin verificar el cálculo financiero y el render HTML.

## Sites

`.openai/hosting.json` contiene el identificador del proyecto. El flujo correcto es:

1. Trabajar en el repositorio fuente.
2. Validar el estado que se quiere publicar.
3. Crear un commit con ese estado.
4. Guardar una versión usando exactamente ese `commit_sha`.
5. Desplegar solamente la versión guardada.
6. Revisar el estado del despliegue y probar el enlace público.

No se deben subir archivos `.env`, credenciales, datos de clientes ni carpetas generadas como `dist/`, `.next/`, `.wrangler/` o `node_modules/`.
