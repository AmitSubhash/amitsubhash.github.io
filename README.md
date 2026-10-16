# amit-subhash

Portfolio. Ghost text describing my research flows around a brain outline, illuminated by colored tracers that travel along neural pathways. Built with [@chenglou/pretext](https://github.com/chenglou/pretext) for real-time text measurement and obstacle-aware reflow at 60fps.

**[Live site](https://amitsubhash.github.io/)**

## Features

- Text reflows around moving tracer obstacles using Pretext's `layoutNextLine` with zero DOM measurement
- Three colored tracers (amber, teal, silver) travel a brain-shaped path
- CSS radial mask spotlight reveals ghost text as tracers pass
- Cursor becomes an interactive tracer that pushes and illuminates text
- Binaural theta beats (174Hz / 180Hz) on first interaction
- Dense EEG spike traces in the background
- Brain outline pulses periodically to reveal its shape
- Responsive with mobile touch support

## Development

```bash
npm install                  # @chenglou/pretext (root package.json)
cd direction-a && npm install # esbuild
npx esbuild main.ts --bundle --format=esm --target=es2022 --minify --outfile=../dist/main.js
```

`index.html` loads the root `dist/main.js`; `npm run build` writes to the ignored `direction-a/dist/` instead.

## Stack

- [@chenglou/pretext](https://github.com/chenglou/pretext) -- text measurement and layout
- Vanilla TypeScript
- Canvas 2D for brain outline and tracer rendering
- Web Audio API for binaural beats
- esbuild for bundling
