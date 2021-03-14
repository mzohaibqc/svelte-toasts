import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import sveld from 'sveld';
import pkg from './package.json';

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

function createConfig({ file, format, minify = false, docs = false }) {
  const isUmd = format === 'umd';
  return {
    input: 'src/index.js',
    output: {
      file,
      format,
      ...(isUmd ? { name: 'SvelteToasts', exports: 'named' } : {}),
    },
    plugins: [
      svelte({
        emitCss: false,
      }),
      resolve({
        dedupe: (importee) =>
          importee === 'svelte' || importee.startsWith('svelte/'),
      }),
      commonjs(),
      minify && terser(),
      docs &&
        sveld({
          markdown: true,
          json: true,
        }),
    ],
  };
}

export default [
  createConfig({ file: pkg.module, format: 'es' }),
  createConfig({ file: pkg.main, format: 'umd' }),
  createConfig({ file: pkg.unpkg, format: 'umd', minify: true }),
];
