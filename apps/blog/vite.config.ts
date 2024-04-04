/// <reference types="vitest" />

import analog from '@analogjs/platform';
import * as fs from 'fs';
import { defineConfig } from 'vite';

const posts = fs.readdirSync(__dirname + '/src/content');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    publicDir: 'src/public',

    build: {
      outDir: '../../dist/apps/blog/client',
      target: ['es2020'],
    },
    plugins: [
      analog({
        static: true,
        prerender: {
          routes: async () => [
            '/',
            '/blog',
            '/api/rss.xml',
            ...posts.map((post) => `/blog/posts/${post.replace('.md', '')}`),
          ],
        },
        nitro: {
          logLevel: 3,
        },
      }),
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
