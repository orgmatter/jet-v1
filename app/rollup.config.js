import { config } from 'dotenv';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import json from "@rollup/plugin-json";
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import typescript from '@rollup/plugin-typescript';
import { sveltePreprocess } from 'svelte-preprocess/dist/autoProcess';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import dev from 'rollup-plugin-dev';

config();
const development = process.env.DEVELOPMENT === 'true';

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: development,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',
    globals: {
      // 'cron': 'CronJob'
    }
  },
  // external: ['cron'],
  plugins: [
    svelte({
      preprocess: sveltePreprocess({ sourceMap: development }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: development
      }
    }),
    babel(),
    replace({
      preventAssignment: true,

      // The following variables will be available in
      // the svelte app. JSON.stringify(process.env.IDL)
      jetDev: development,
      jetIdl: JSON.stringify("devnet"),
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    nodeResolve({
      browser: true,
      dedupe: ['svelte'],
      preferBuiltins: true,
    }),
    commonjs(),

    typescript({
      sourceMap: development,
      inlineSources: development
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    development && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    development && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    !development && terser(),
    !development && dev({
      dirs: ['public'],
      spa: 'public/index.html',
      host: 'localhost',
      port: 3000,
      proxy: [{
        from: "/bapi/c2c/v2/friendly/c2c/adv/search",
        to: "https://p2p.binance.com"
      }]
    }),
    json({
      compact: true
    }),
    globals(),
    builtins()
  ],
  // suppress eval warning
  onwarn(warning, warn) {
    if (warning.code === 'EVAL') return
    warn(warning)
  },
  watch: {
    clearScreen: false
  }
};
