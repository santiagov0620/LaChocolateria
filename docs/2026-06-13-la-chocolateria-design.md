# La Chocolatería by Belate — Design Spec

**Date:** 2026-06-13
**Type:** Single-page immersive brand experience (flat HTML/CSS/JS)

## Brand truth (verified)
- Café · chocolatería · pastelería in **Cochabamba, Bolivia**, by sisters **Eliana & Lorena González**.
- Concept: **artisanal Belate chocolate fused with fine pastry** + specialty coffee. Voice: *dulzura y calidez*.
- Signatures customers cite: rich **hot chocolate**, **molten "volcán" dessert**, specialty coffee, **tortas/cakes**, croque monsieur & turkey sandwiches on homemade bread, smoothies.
- Contact: Ciclovía entre Av. Villarroel y Santa Cruz · +591 78377793 · lachocolateriabybelate@gmail.com · IG @lachocolateriabybelate · dine-in / takeout / delivery.
- Anything unverified (exact hours, prices, WhatsApp, full menu) → `[CONFIRMAR …]` placeholders.

## Creative concept
**"Ábrela como una caja de chocolates."** A dark, warm, editorial atelier. Each scroll reveals a composed compartment.

## Art direction
- **Palette:** espresso `#1C110B`, cacao `#2E1A10`, cocoa `#4A2C1A`, caramel `#C68A4E`, cream `#F3E7D6`, beige `#E4D2BC`, cherry accent `#8E3B33`, gold (sparing) `#C9A24B`.
- **Type:** Fraunces (display serif, warm/editorial) · Hanken Grotesk (body) · mono-tracked indices for archival labels.
- **Texture:** film grain overlay, warm radial glows, generous negative space.

## Sections
A Preloader (line draw + counter) · B Cinematic hero · C Manifesto (word-reveal) · D Especialidades (pinned horizontal scroll) · **E "La Caja" — signature compartment-reveal interaction** · F Tortas (custom cakes) · G Catering · H Instagram moments (editorial collage) · I Visítanos (info + map) · J Footer.

## Interaction & tech
- Lenis smooth scroll + GSAP/ScrollTrigger. Custom cursor + magnetic buttons (desktop). Full-screen menu overlay.
- Drop-in image slots: `assets/images/<name>.jpg` with elegant labeled placeholders shown until real photos arrive (`onerror` fallback).
- Full `prefers-reduced-motion` support, lazy loading, semantic HTML, keyboard nav, skip link.

## Decisions (user-confirmed)
- User provides real photos later → build labeled drop-in slots.
- Signature interaction = chocolate-box compartments.
- Proceed straight to build.
