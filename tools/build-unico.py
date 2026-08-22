#!/usr/bin/env python3
"""
Funde index.html + styles.css + main.js en capi-landing-completa.html.

Uso, desde la raíz del proyecto:

    python3 tools/build-unico.py

Correlo cada vez que toques cualquiera de los tres archivos sueltos, o el
archivo único se queda atrás sin avisar.
"""

import os
import sys

CSS_TAG = '<link rel="stylesheet" href="styles.css?v=20260822b">'
JS_TAG = '<script defer src="main.js?v=20260822b"></script>'
SALIDA = "capi-landing-completa.html"


def main():
    for f in ("index.html", "styles.css", "main.js"):
        if not os.path.exists(f):
            sys.exit("Falta %s — ¿estás en la raíz del proyecto?" % f)

    html = open("index.html", encoding="utf-8").read()
    css = open("styles.css", encoding="utf-8").read()
    js = open("main.js", encoding="utf-8").read()

    if CSS_TAG not in html or JS_TAG not in html:
        sys.exit(
            "No encontré las etiquetas de styles.css / main.js en index.html.\n"
            "Si cambiaste el cache-buster (?v=...), actualizá CSS_TAG y JS_TAG\n"
            "arriba en este script."
        )

    html = html.replace(CSS_TAG, "<style>\n" + css + "\n</style>")
    html = html.replace(JS_TAG, "<script>\n" + js + "\n</script>")

    with open(SALIDA, "w", encoding="utf-8") as f:
        f.write(html)

    print("✓ %s — %.1f KB" % (SALIDA, len(html.encode()) / 1024))


if __name__ == "__main__":
    main()
