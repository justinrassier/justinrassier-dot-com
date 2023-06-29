/// <reference types="vitest" />

import analog from '@analogjs/platform';
import * as fs from 'fs';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

const posts = fs.readdirSync(__dirname + '/src/content');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    publicDir: 'src/public',

    build: {
      target: ['es2020'],
    },
    plugins: [
      analog({
        static: true,
        prerender: {
          routes: async () => [
            '/',
            '/blog',
            ...posts.map((post) => `/blog/posts/${post.replace('.md', '')}`),
          ],
        },
      }),
      tsConfigPaths({
        root: '../../',
      }),
      splitVendorChunkPlugin(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      cache: {
        dir: `../../node_modules/.vitest`,
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
