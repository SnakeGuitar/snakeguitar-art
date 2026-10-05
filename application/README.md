# SnakeGuitar — portfolio & commissions

Portfolio multilingüe de ilustración y comisiones, construido con Next.js y preparado para Vercel.

## Desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Arquitectura

- `app/`: composición de rutas, metadata y estilos globales.
- `components/`: UI y estado de interacción.
- `domain/`: entidades y reglas puras del catálogo/comisiones.
- `lib/`: adaptadores y diccionarios de internacionalización.
- `public/art/`: derivados WebP optimizados; los originales permanecen en `../drawings`.

La separación mantiene las reglas de precios fuera de React sin introducir repositorios, factories o casos de uso vacíos. Para cambiar precios u obras, edita `domain/commission.ts`; para modificar textos, `lib/i18n.ts`.

## UI e idiomas

La interfaz utiliza un sistema editorial claro/oscuro en marfil, tinta y topo, con una retícula de galería adaptable. Incluye inglés de EE. UU., español de México, portugués brasileño, japonés y coreano. El tema y el idioma se conservan en `localStorage`.

## Música

Coloca archivos `.mp3`, `.ogg`, `.wav`, `.m4a`, `.aac` o `.flac` en `public/music`. La ruta estática `/api/music` genera automáticamente la lista del reproductor; después de agregar archivos, reinicia `npm run dev` o vuelve a desplegar.

## Deploy

En Vercel importa el repositorio y selecciona `application` como **Root Directory**. El preset de Next.js se detecta automáticamente.
