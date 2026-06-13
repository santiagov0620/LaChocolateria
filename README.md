# La Chocolatería by Belate — Sitio web

Experiencia web inmersiva de una sola página para **La Chocolatería by Belate** (Cochabamba, Bolivia).
Concepto: *"Ábrela como una caja de chocolates"* — un atelier editorial del cacao, cálido y cinematográfico.

---

## 1. Cómo ejecutar el proyecto

Es **código plano** (HTML/CSS/JS), sin paso de compilación. Necesita servirse por HTTP (no abrir el archivo con `file://`, porque las fuentes y los `fetch` se bloquean).

Opciones:

```bash
# Opción A — Python (ya instalado en la mayoría de equipos)
cd la-chocolateria
python -m http.server 5173
# abre http://localhost:5173

# Opción B — Node
npx serve la-chocolateria

# Opción C — VS Code
# Extensión "Live Server" → clic derecho en index.html → "Open with Live Server"
```

---

## 2. Estructura de archivos

```
la-chocolateria/
├── index.html            # Estructura y contenido de todas las secciones
├── css/styles.css        # Sistema de diseño completo (tokens, secciones, responsive, reduced-motion)
├── js/main.js            # Preloader, smooth scroll, animaciones, interacción "La Caja", cursor, menú
├── assets/
│   ├── images/           # ← coloca aquí las fotos reales (ver images/README.md)
│   └── video/            # opcional, para el hero en video
├── docs/                 # spec de diseño
└── README.md
```

---

## 3. Dónde reemplazar los videos y el logo

El sitio está construido con **video** (los reels reales) + el **logo oficial**. Los detalles completos
están en [`assets/images/README.md`](assets/images/README.md). En resumen:

- Videos en `assets/video/v1.mp4` … `v6.mp4`. Para cambiar uno, reemplázalo con el mismo nombre y
  regenera su poster con ffmpeg (comando en esa guía). No hay que tocar el código.
- Logo en `assets/images/logo.jpg` (usado en preloader, footer y favicon). Si consigues un PNG con
  fondo transparente, reemplázalo y actualiza las 3 referencias.
- Los videos solo se reproducen cuando entran en pantalla (rendimiento) y tienen un *poster* de
  respaldo para conexiones lentas y para usuarios con *reduced-motion*.

---

## 4. Dónde actualizar los datos del negocio

Todo está en `index.html`. Busca estas etiquetas para confirmarlas o corregirlas (aparecen marcadas en rojo en el sitio):

- `[CONFIRMAR HORARIOS]` — menú overlay y sección *Visítanos*.
- `[CONFIRMAR NÚMERO DE WHATSAPP]` — sección *Visítanos* (ver punto 5).
- `[CONFIRMAR SABORES]`, `[CONFIRMAR CAPACIDAD]`, `[CONFIRMAR SELECCIÓN DE BOMBONES]`.

Datos ya cargados (verificados de fuentes públicas — revísalos por si cambiaron):
- **Dirección:** Ciclovía, entre Av. Villarroel y Santa Cruz, Cochabamba.
- **Teléfono:** +591 78377793 · **Email:** lachocolateriabybelate@gmail.com
- **Fundadoras:** Eliana & Lorena González.

---

## 5. Dónde actualizar los enlaces de contacto

En `index.html`:

| Enlace | Búscalo como | Nota |
|---|---|---|
| WhatsApp | `https://wa.me/59178377793?...` | Cambia el número si el de WhatsApp es distinto al de teléfono. Formato internacional sin `+` ni espacios. |
| Teléfono | `href="tel:+59178377793"` | |
| Email | `href="mailto:lachocolateriabybelate@gmail.com"` | |
| Instagram | `https://www.instagram.com/lachocolateriabybelate/` | |
| Facebook | `https://www.facebook.com/LaChocolateriaByBelate/` | |
| Mapa | `https://www.google.com/maps/search/?...` | Reemplázalo por el enlace exacto de Google Maps del local. |

---

## 6. Interacciones implementadas

- **Preloader** con contador y revelado de marca; se salta automáticamente con *reduced-motion*.
- **Smooth scroll** (Lenis) sincronizado con las animaciones.
- **Hero cinematográfico**: revelado por líneas enmascaradas + parallax de la imagen.
- **Manifiesto**: texto que se ilumina palabra por palabra al hacer scroll.
- **Especialidades**: scroll **horizontal** anclado con **video** en cada panel (en táctil/reduced-motion pasa a swipe nativo).
- **Video play-on-visible**: cada clip se reproduce solo cuando entra en pantalla y se pausa al salir.
- **"La Caja"** (interacción estrella): al hacer scroll, la **tapa se levanta** y los **compartimentos** de bombones se revelan en secuencia, como abrir una caja de chocolates.
- **Tortas / Catering / Visítanos**: revelados escalonados al entrar en viewport.
- **Collage de Instagram** editorial (no es un embed genérico) con CTA al perfil.
- **Cursor personalizado** con etiquetas contextuales (solo escritorio con puntero fino).
- **Botones magnéticos** y estados hover refinados.
- **Menú overlay** a pantalla completa, accesible con teclado (Esc para cerrar).

---

## 7. Librerías utilizadas

| Librería | Uso | Carga |
|---|---|---|
| [GSAP 3.12](https://gsap.com/) + ScrollTrigger | Animaciones y scroll choreography | CDN (jsDelivr) |
| [Lenis 1.0](https://github.com/darkroomengineering/lenis) | Smooth scroll | CDN (jsDelivr) |
| Google Fonts: **Fraunces**, **Hanken Grotesk**, **Martian Mono** | Tipografía | CDN |

> Si necesitas que el sitio funcione **sin internet** o cumplir con privacidad (GDPR), descarga estas librerías y fuentes y sírvelas localmente. El código degrada con elegancia si una librería no carga.

---

## 8. Accesibilidad y rendimiento

- HTML semántico, *skip link*, navegación por teclado, `aria` en el menú.
- Soporte completo de `prefers-reduced-motion` (desactiva preloader, parallax, cursor y scrubs).
- `loading="lazy"` en imágenes bajo el pliegue.
- Sin saltos de layout: se refresca ScrollTrigger cuando cargan las fuentes.

---

## 9. Pendientes para producción

- [x] Horarios (Mar–Dom 15:30–21:30, Lunes cerrado) y mapa (OpenStreetMap, pin en -17.369332, -66.158131).
- [ ] Confirmar **número de WhatsApp** y **sabores de torta** (`[CONFIRMAR …]` en rojo en el sitio).
- [ ] (Opcional) Logo en PNG transparente para reemplazar `logo.jpg`.
- [ ] (Opcional) `og-cover.jpg` propio (hoy usa `poster-v2.jpg`).
- [ ] (Opcional) Autohospedar fuentes y librerías para privacidad/offline.
- [ ] (Recomendado) Comprimir más los videos si quieres aún más velocidad (p. ej. `-crf 28`).
