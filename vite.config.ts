import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { partytownSnippet } from '@qwik.dev/partytown/integration';
import { partytownVite } from '@qwik.dev/partytown/utils';

export default defineConfig(() => {
  return {
    build: { manifest: true },
    plugins: [react(), tailwindcss(),
      partytownVite({ dest: path.resolve('dist/~partytown'), debug: false }),
      { name: 'tracking-worker', transformIndexHtml: (html: string) => html.replace('<!--tracking-worker-->', `<script>${partytownSnippet({
        forward: ['dataLayer.push'],
        // GTM's preview bootstrap has no CORS headers. Load this debug-only
        // script in the page context while keeping the production container
        // and its other tags in the worker.
        loadScriptsOnMainThread: [/googletagmanager\.com\/debug\/bootstrap/],
      })}</script>`) },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR can be disabled through the DISABLE_HMR environment variable.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
