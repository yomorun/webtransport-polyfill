const build = await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './out',
  target: 'node',
  format: "esm",
  splitting: false,
  sourcemap: "external",
  minify: false,
});

console.log(`Build: ${build.success}`)

for (const log of build.logs) {
  console.log(log)
}

for (const output of build.outputs) {
  console.log(output)
}
