# Project Learnings: Neuro-Themed Portfolio with Pretext

## What We Built

An interactive portfolio page at **amitsubhash.github.io** where:
- Ghost text (a personal creed mixing Rockefeller philosophy + research narrative) fills the entire viewport
- A traced brain SVG outline spans the page as a background element
- Three colored tracers (amber, teal, silver) travel along the brain outline
- Text reflows around tracers using Pretext's `layoutNextLine` with obstacle carving at 60fps
- A CSS radial mask spotlight reveals text near each tracer -- characters glow as light passes
- The cursor becomes a 4th tracer (warm gold dot, hidden native cursor) that pushes and illuminates text
- Binaural theta beats (174Hz/180Hz, 6Hz difference) play on first interaction
- Brain outline draws itself stroke-by-stroke on load, then transitions to periodic pulse
- Clicking the name reveals a hidden tagline
- Hovering "Indiana University" turns text IU crimson

## Architecture

```
index.html          -- minimal shell
style.css           -- all styling, rem-based fluid sizing
brain.ts            -- EditorialBrain class (Pretext layout, canvas rendering, animation loop)
main.ts             -- boot, binaural beats, responsive resize handler
brain-traced.svg    -- potrace output from anatomical reference image
brain-outer.txt     -- extracted outer contour path data (absolute coords)
```

## Key Technical Decisions

### Pretext Usage
- `prepareWithSegments(text, font)` -- called once on init, measures all text
- `layoutNextLine(prepared, cursor, maxWidth)` -- called per-line per-frame for obstacle-aware reflow
- This is the genuine use case: text measurement without DOM, layout at 60fps
- The text layout is the hot path -- ~30 lines recalculated every frame

### Rendering Layers
1. **Canvas** (z-index 2) -- brain outline (Path2D with smooth beziers), tracer trails/dots, cursor dot, outline proximity glow
2. **Text spans** (z-index 1) -- absolutely positioned, opacity/mask/color updated per frame
3. **Identity block** (z-index 3) -- HTML, dark ellipse `::before` pseudo-element for background

### Brain Outline: SVG Path vs Polygon
- The visible outline uses `new Path2D(svgPathData)` for smooth bezier curves
- The tracer path uses 151 evenly-sampled points from the same beziers
- Both use the same coordinate transform so they align perfectly
- The SVG path was traced from a PNG reference using `potrace`

### Spotlight Effect
- Each text line gets a CSS `mask` / `-webkit-mask` with radial gradients
- Multiple light sources composite via `mask-composite: add`
- Distance calculation uses closest-point-on-line-segment (not line center) for accuracy
- Center fade zone dampens spotlight near the identity block

### Performance Considerations
- Text layout (`layoutNextLine`) is ~0.1ms per call (Pretext's main selling point)
- DOM updates: only when line text content actually changes (diffed against previous frame)
- Canvas: cleared and redrawn each frame (~15 draw calls for outline + tracers)
- CSS mask strings are rebuilt per-frame per-line (~30 string concatenations)
- The per-element text-shadow approach was too expensive -- replaced with a single `::before` gradient

### What Caused Lag
- Multiple layered `text-shadow` on identity elements (4 shadows x 4 elements = 16 shadow passes)
- Dynamic cursor color switching with distance calculations every frame
- Solution: replaced text-shadows with one `::before` radial gradient, removed cursor color logic

## Design Evolution (10+ iterations)

1. **v1-v3**: Character grid inside brain mask (fluid smoke style) -- looked like noise
2. **v4-v5**: Stitched research words in brain mask with fluid sim -- overstimulating
3. **v6**: SVG brain outline + text grid inside -- brain didn't look like a brain
4. **v7-v8**: Editorial engine -- text reflows around brain obstacle -- right direction
5. **v9**: Spotlight effect -- ghost text revealed by tracer light -- breakthrough
6. **v10**: CSS radial mask per-line for gradual character reveal
7. **v11**: Tracer as BOTH obstacle AND spotlight -- best of both worlds
8. **v12**: Three colored tracers (amber, teal, silver)
9. **v13**: Cursor as interactive tracer, font-weight shifts
10. **v14+**: Potrace-traced brain SVG, stroke-draw intro, binaural beats, mobile, polish

## What Worked
- Ghost text + spotlight is a powerful combination -- text exists everywhere but only reveals near light
- The personal creed content (Rockefeller + research) makes every revealed fragment meaningful
- Three different colored lights create visual richness without complexity
- Cursor-as-tracer makes the page interactive without explicit UI
- The stroke-draw intro immediately communicates "this is a brain"
- Pretext's obstacle-aware reflow creates a physically tangible feeling -- text has weight

## What Didn't Work
- Character grids inside brain masks (always looked like noise)
- Hand-drawn brain polygons (never looked anatomical enough)
- Straight-line polygon segments for the brain outline (needed smooth beziers)
- Multiple text-shadows for dark halos (too expensive, caused lag)
- Cursor color switching on hover (caused frame drops)
- Too many emitters/cascades in the fluid sim (overstimulating)
- The reverse-direction tracer (felt unnatural)
- Pink/rose tracer color (didn't fit the palette)

## Tools & Stack
- **@chenglou/pretext** -- text measurement and layout engine
- **potrace** -- bitmap to vector tracing (brain outline)
- **esbuild** -- bundler (10ms builds)
- **Canvas 2D** -- brain outline, tracers, cursor dot
- **Web Audio API** -- binaural beats
- **CSS masks** -- spotlight effect on text
- **GitHub Pages** -- hosting

## Useful Patterns
- `Path2D` with SVG path strings for complex shapes on canvas
- `setLineDash` + `lineDashOffset` for stroke-draw animations
- CSS `mask` with `radial-gradient` for per-element spotlight reveals
- `mask-composite: add` for overlapping light sources
- `clamp()` for fluid root font sizing
- Sampling points along bezier curves for even distribution (arc-length parameterization)
