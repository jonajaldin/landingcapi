# CAPIWARA.COM — Landing de una sola pantalla

HTML + CSS + JS vanilla. **Sin frameworks, sin npm, sin build.** Todo entra en
el viewport: no hay scroll, no hay secciones debajo.

```
index.html                  ← la página
styles.css                  ← todo el diseño
main.js                     ← animaciones + el link de destino
capi-landing-completa.html  ← las tres anteriores fundidas en un solo archivo
.htaccess                   ← caché correcta en Hostinger (importante)
robots.txt
assets/img/                 ← las dos imágenes (ver LEEME.txt)
tools/                      ← utilidades de desarrollo, no hace falta subirlas
```

Dos formas de publicar, elegí una:

- **Rápida** — subí solo `capi-landing-completa.html` (renombralo `index.html`)
  y la carpeta `assets/`.
- **Hostinger** — subí todo. El `.htaccess` evita que te sirva CSS viejo
  durante días después de cada actualización.

---

## 1. El link de destino

En `main.js` (o dentro del `<script>` final, si usás el archivo único):

```js
var CONFIG = {
  DESTINO: 'https://capiwara.com/',   // ← poné tu link acá
  NUEVA_PESTANA: true
};
```

También está escrito en los `href` del HTML como respaldo, por si el JS no
llega a ejecutarse. El JS lo pisa al cargar.

## 2. Las dos imágenes

Ver `assets/img/LEEME.txt`. Resumen:

| Archivo | Dónde va | Fondo |
|---|---|---|
| `jugador.png` | Dentro de la carta con marco dorado | Da igual, el marco lo integra |
| `capibara-hero.png` | Delante de la carta, abajo a la izquierda | Transparente (PNG recortado) |

Si falta alguna, `main.js` lo detecta y muestra un balón tenue en su lugar: la
página no se rompe, sólo pega menos.

Para reencuadrar la foto del jugador, en `styles.css` → `.pimg` →
`object-position: 52% 16%`. Bajá el segundo número para ver más cara.

---

## 3. Qué hay en pantalla

Ticker arriba y abajo (girando en sentidos opuestos), marca centrada, bloque de
texto a la izquierda con el CTA azul, y a la derecha la carta de jugador con el
capibara delante.

**El estadio es CSS puro:** cinco haces de luz que barren a ritmos distintos,
tribuna que parpadea, césped en perspectiva con `rotateX(74deg)`, arco del área,
viñeta y grano. Cero peso extra.

**Encima corren:** un balón que cruza la pantalla en arco cada 8 s, monedas
flotando, 30–80 chispas doradas en canvas, confeti, el degradado dorado del
titular en movimiento, el pulso del CTA y un parallax de cuatro capas que sigue
al mouse.

**Los cuatro jugadores del fondo son siluetas SVG**, articuladas con cápsulas
rotadas: remate, carrera y celebración. No son fotos — pesan prácticamente nada
y no dependen de derechos de imagen de nadie.

### Decisiones que conviene no deshacer

- **`prefers-reduced-motion` no apaga las microinteracciones.** Windows lo trae
  activado de fábrica en muchos equipos y dejaría la página muerta. Sólo apaga
  el confeti, el balón que cruza, los destellos y los bucles infinitos.
- **Nada de `<script type="module">`.** Funciona hasta abriendo el archivo con
  doble clic.
- **Cada `init` va dentro de `safe()`**: si uno falla, los demás siguen.
- **El destello del titular se quitó a propósito.** Con `background-clip:text`,
  tanto `mix-blend-mode:overlay` como `filter:drop-shadow` pintan la caja del
  elemento en vez de las letras, y dejaban un recuadro gris visible detrás de
  "AL MÁXIMO".

### Cada vez que actualices

Cambiá la fecha del cache-buster en `index.html`:

```html
<link rel="stylesheet" href="styles.css?v=20260822b">
<script defer src="main.js?v=20260822b"></script>
```

Sin esto, Hostinger puede seguir sirviendo el CSS viejo durante días.

---

## 4. Herramientas de desarrollo

```bash
# Rehacer el archivo único después de tocar los tres sueltos
python3 tools/build-unico.py

# Ver cómo queda (captura desktop + móvil en tools/)
NODE_PATH=/opt/node22/lib/node_modules node tools/shot.js
```

---

## 5. Nota legal

El pie lleva aviso `+18` y mensaje de juego responsable. Revisalo contra la
normativa del país donde compres tráfico: varias jurisdicciones exigen textos,
licencias o enlaces a organismos de ayuda concretos, y las plataformas de ads
rechazan creatividades sin ellos.

Sobre imágenes de futbolistas: usar el parecido de un jugador real e
identificable en una pieza comercial necesita derechos de imagen. Por eso las
siluetas del fondo son anónimas. Si ponés una foto de una persona reconocible en
`jugador.png`, asegurate de tener la licencia antes de invertir en anuncios.
