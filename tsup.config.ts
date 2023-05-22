import { defineConfig } from 'tsup';
import { name } from './package.json'

export default defineConfig({
    name,
    entry: ['./src/index.tsx'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    minify: true,
    target: 'es2018',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
})