# Landing Manada Capiwara

Sitio estático. **Esta carpeta es la que se sube a Netlify** (arrastrala entera,
o configurala como *publish directory*): `_headers` debe quedar en la raíz del
sitio publicado para que el cacheo funcione.

## Estructura

- `index.html` — la página (~50 KB)
- `_headers` — cacheo de Netlify: `assets/` inmutable a 1 año, HTML siempre fresco
- `assets/` — imágenes, video, fuentes y JS, todo autoalojado (sin CDN externo)

## Notas

- Las imágenes son WebP en la resolución en la que realmente se muestran.
  Si se reemplazan, exportar en WebP y no en PNG: los PNG originales
  pesaban 14,5 MB entre los dos.
- Las fuentes usan `unicode-range`, así que el navegador solo descarga los
  subconjuntos latinos (~115 KB). Los demás archivos nunca se piden.
- El video del hero usa `preload="metadata"`: el póster se ve primero y el
  MP4 se transmite después, sin bloquear el primer pintado.
