import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({
      rollupConfig: { external: [/^@sentry\//] },
      // The photography is content-addressed by hand: a file at
      // /images/heritage/konark/03.jpg never changes, it is only ever added to.
      // Without this the host serves it `max-age=0, must-revalidate`, so every
      // navigation spends a round trip revalidating ~300 images that were
      // already on disk — which is what makes them appear to load late.
      routeRules: {
        '/images/**': {
          headers: { 'cache-control': 'public, max-age=31536000, immutable' },
        },
        '/vault/**': {
          headers: { 'cache-control': 'public, max-age=31536000, immutable' },
        },
      },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})

export default config
