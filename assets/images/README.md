# Assets — guía de reemplazo

El sitio funciona con **video** (los reels de Instagram) + el **logo** + unos *posters* (cuadros congelados de cada video).

## Carpetas
- `assets/video/` → los videos (`v1.mp4` … `v6.mp4`).
- `assets/images/` → el logo, los posters y un par de imágenes estáticas.

## Videos (lo que usa cada uno)

| Archivo | Contenido actual | Dónde aparece |
|---|---|---|
| `v2.mp4` | Ganache sobre torta | **Hero** (fondo) + collage Instagram + caja |
| `v5.mp4` | Vaina de cacao abriéndose | Especialidades · *Cacao* + caja |
| `v1.mp4` | Ambiente de cafetería (café) | Especialidades · *Café* + collage + caja |
| `v4.mp4` | Choux (pastelería) | Especialidades · *Pastelería* + collage + caja |
| `v6.mp4` | Chocolate caliente | Especialidades · *Chocolate caliente* + collage + caja |
| `v3.mp4` | Torta red velvet | **Catering** + collage + caja |
| `v7.mp4` | Torta rosada decorada (con logo) | **Tortas** |

**Para cambiar un video:** reemplaza el archivo en `assets/video/` con el mismo nombre **y** regenera su poster (abajo). No hay que tocar el código.

## Posters (cuadro fijo de cada video)
`poster-v1.jpg` … `poster-v6.jpg`. Se muestran antes de que cargue el video, dan el primer frame, sirven de respaldo cuando el usuario tiene *reduced-motion* y forman los 6 compartimentos de la sección **"La Caja"**.

Regenerar un poster (necesita ffmpeg):
```bash
ffmpeg -ss 2 -i assets/video/v2.mp4 -frames:v 1 -q:v 4 assets/images/poster-v2.jpg
```
(`-ss 2` = toma el cuadro del segundo 2; cámbialo para elegir mejor frame.)

## Logo
`logo.jpg` — el logo oficial. Se usa en el preloader, el footer (insignia) y el favicon.
Truco: como el JPG tiene fondo blanco, en superficies claras se aplica `mix-blend-mode: multiply` para que el blanco desaparezca. Si algún día tienes el logo en **PNG con fondo transparente**, reemplaza `logo.jpg` por `logo.png` (y actualiza las 3 referencias en `index.html` / `css/styles.css`).

## Imágenes estáticas pendientes
- `mapa.jpg` → captura del mapa o foto de la fachada (sección *Visítanos*). Mientras no exista, se muestra un placeholder elegante.
- `og-cover.jpg` (opcional, 1200×630) para compartir el enlace. Hoy se usa `poster-v2.jpg`.

## Consejos
- Mantén los videos comprimidos (~1–4 MB). Solo se reproducen cuando entran en pantalla.
- Conserva una luz cálida y coherente entre clips para no romper la dirección de arte.
