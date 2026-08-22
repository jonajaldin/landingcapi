#!/usr/bin/env python3
"""
Extrae las imágenes del capibara que estaban incrustadas en base64 dentro de
la versión anterior de index.html (commit 3d04dc6) y las guarda como archivos
reales en assets/img/.

Uso (desde la raíz del proyecto):

    python3 tools/extraer-capibara.py

Después renombrá el archivo más grande a:

    assets/img/capibara-hero.png       (el protagonista del hero)
    assets/img/capibara-estadio.png    (el de la sección "El ambiente")

No hace falta para que la web funcione: si las imágenes no existen, la landing
muestra automáticamente una composición alternativa y sigue viéndose bien.
"""

import base64
import os
import re
import subprocess
import sys

COMMIT = "3d04dc6"
OUT = os.path.join("assets", "img")


def leer_html():
    # 1) intento con el archivo actual, por si alguien lo restauró
    if os.path.exists("index.html"):
        txt = open("index.html", encoding="utf-8", errors="ignore").read()
        if "base64," in txt:
            return txt
    # 2) lo saco del historial de git
    try:
        return subprocess.check_output(
            ["git", "show", "%s:index.html" % COMMIT], text=True, errors="ignore"
        )
    except Exception as e:
        sys.exit("No pude leer el HTML antiguo desde git (%s)" % e)


def main():
    html = leer_html()
    os.makedirs(OUT, exist_ok=True)

    patron = re.compile(r"data:image/(webp|png|jpeg|jpg);base64,([A-Za-z0-9+/=]+)")
    vistos = set()
    encontrados = []

    for m in patron.finditer(html):
        ext, b64 = m.group(1), m.group(2)
        try:
            raw = base64.b64decode(b64)
        except Exception:
            continue
        if len(raw) < 4000 or len(raw) in vistos:
            continue
        vistos.add(len(raw))
        ext = "jpg" if ext == "jpeg" else ext
        nombre = "capibara-%02d.%s" % (len(encontrados) + 1, ext)
        ruta = os.path.join(OUT, nombre)
        with open(ruta, "wb") as f:
            f.write(raw)
        encontrados.append((ruta, len(raw)))
        print("  ✓ %-34s %6.1f KB" % (ruta, len(raw) / 1024))

    if not encontrados:
        print("No encontré imágenes incrustadas.")
        return

    encontrados.sort(key=lambda x: -x[1])
    print("\nLa más grande (probable hero): %s" % encontrados[0][0])
    print("Renombrala a assets/img/capibara-hero.png y listo.")


if __name__ == "__main__":
    main()
