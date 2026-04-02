import esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const config = {
  entryPoints: ["main.ts"],
  bundle: true,
  outfile: "dist/main.js",
  format: "esm",
  target: "es2022",
  sourcemap: true,
  minify: !watch,
  logLevel: "info",
};

if (watch) {
  const ctx = await esbuild.context(config);
  await ctx.watch();
  console.log("Watching for changes...");
} else {
  await esbuild.build(config);
}
