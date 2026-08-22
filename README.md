# CAPI — Landing fútbol premium

Landing de una sola página, HTML + CSS + JS vanilla. **Sin frameworks, sin npm, sin build.**
Se sube arrastrando la carpeta a Hostinger, Netlify o cualquier hosting estático.

```
index.html          ← la página
styles.css          ← todo el diseño
main.js             ← animaciones + configuración del link
.htaccess           ← caché correcta en Hostinger (importante)
robots.txt
assets/img/         ← acá van las 2 imágenes del capibara
tools/              ← utilidad opcional
```

---

## 1. Cambiar el link de destino (lo único obligatorio)

El link está en **dos sitios**, a propósito (uno es el respaldo del otro):

**`main.js`**, arriba del todo:

```js
var CONFIG = {
  DESTINO: 'https://capiwara.com/',   // ← poné tu link acá
  NUEVA_PESTANA: true
};
```

**`index.html`** — buscá `https://capiwara.com/` y reemplazá las 4 apariciones
(los `href` de los botones azules). Si no lo hacés, el JS igual pisa el valor
al cargar; el HTML es sólo la red de seguridad por si el JS falla.

> Se usó `https://capiwara.com/` como valor por defecto porque es el destino
> que tenía la versión anterior del repo. En el brief el link venía como
> `[PEGA_AQUÍ_EL_LINK]`, sin rellenar.

---

## 2. Las imágenes del capibara

Ver `assets/img/LEEME.txt`. Resumen: dos archivos,
`capibara-hero.png` y `capibara-estadio.png`.

Si no están, **la web no se rompe**: `main.js` detecta el error de carga y
activa una composición alternativa (balón dorado sobre luces de estadio).

### Prompts listos para Magnific

*Hero (proporción 4:5 o 1:1):*

> Ultra-realistic cinematic 3D render of a charismatic capybara mascot with a
> calm, confident expression, wearing an elegant black hoodie and a subtle gold
> chain, standing on a football pitch at night. Warm golden stadium floodlights
> and lens flares behind him, blurred packed crowd in the stands, a football at
> his feet, golden particles floating in the air. Deep black and warm gold
> colour grading, luxury sports photography, shallow depth of field. No text,
> no logos, no brand marks.

*Sección "El ambiente" (proporción 5:6, vertical):*

> Cinematic vertical composition: the same capybara character celebrating on a
> floodlit football pitch at night, arms raised, golden confetti falling,
> stadium stands glowing behind, dramatic rim light, black and gold palette,
> premium editorial sports photography, volumetric light beams. No text, no
> logos.

Después pasalo por **upscale** (modo `creative`, preset `subtle`, 2x) para
que aguante en pantallas grandes.

### Sobre jugadores reales

El brief pedía jugadores de fútbol reconocibles. La landing **no** los incluye:
usar la imagen o el parecido de futbolistas identificables en una pieza
comercial requiere derechos de imagen, y generarlos con IA para publicidad es
un problema legal real, no un tecnicismo. El universo futbolero se construye
con estadio, luces, césped en perspectiva, balón, hinchada y confeti — que es
lo que transmite la energía sin exponerte. Si conseguís licencias de imágenes
de jugadores, se enchufan en `.moment-art` sin tocar nada más.

---

## 3. Subir a Hostinger

1. Entrá al Administrador de Archivos → carpeta `public_html`.
2. Subí **todo** el contenido de esta carpeta (incluido el `.htaccess`,
   que suele estar oculto — activá "mostrar archivos ocultos").
3. Listo.

En Netlify: arrastrá la carpeta a `app.netlify.com/drop`.

### Cada vez que actualices

Cambiá la fecha del cache-buster en `index.html`:

```html
<link rel="stylesheet" href="styles.css?v=20260822">
<script defer src="main.js?v=20260822"></script>
```

Poné la fecha del día (`?v=20260901`, etc.). Sin esto, Hostinger puede seguir
sirviendo el CSS viejo durante días.

---

## 4. Detalles del diseño

- **Paleta:** negro profundo `#05070c` + oro `#f3c543` + azul eléctrico
  `#1f6bff` reservado **sólo** para el CTA, para que no compita con nada.
- **Tipografía:** Anton (display, condensada y deportiva) + Inter (texto).
  Con fallback a Arial Black / system UI si Google Fonts no carga.
- **Escena de estadio:** hecha íntegramente en CSS — focos con `conic-gradient`,
  césped en perspectiva 3D con `rotateX(72deg)`, arco del área, viñeta y grano.
  Cero peso extra.
- **Chispas doradas:** canvas 2D con 26–62 partículas según ancho; se pausa
  sola cuando el hero sale de pantalla o la pestaña queda en segundo plano.
- **CTA:** 4 botones azules (nav, hero, showcase, final) + una barra fija
  inferior en móvil que aparece pasado el 70 % del primer scroll.

### Robustez

- Cada `init` va dentro de `safe()`: si uno falla, los demás siguen.
- `.reveal` tiene red de seguridad **en CSS** (`animation ... 5s forwards`) y
  otra en JS (timeout de 6 s). Nunca puede quedar texto invisible.
- Splash con triple salida: `load`, timeout de 2,8 s y animación CSS a los 2,6 s.
- `prefers-reduced-motion` **no** apaga las microinteracciones (Windows lo trae
  activado por defecto en muchos equipos y dejaría la web muerta); sólo apaga
  el canvas, el ticker y los bucles infinitos.
- Sin `<script type="module">`, sin imports relativos: funciona hasta abriendo
  `index.html` con doble clic.

---

## 5. Nota legal

El pie incluye aviso `+18` y mensaje de juego responsable. Revisalo con la
normativa del país donde vayas a comprar tráfico: varias jurisdicciones exigen
textos, licencias o enlaces a organismos de ayuda concretos, y las plataformas
de ads rechazan creatividades sin ellos.
