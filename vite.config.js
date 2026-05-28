import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function devServerModuleImportFixes() {
  return {
    name: 'dev-server-module-import-fixes',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url || ''

        if (url.startsWith('/node_modules/vite/dist/client/env.mjs')) {
          req.url = url.replace('/node_modules/vite/dist/client/env.mjs', '/@vite/env')
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    devServerModuleImportFixes(),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom']
  },
  server: {
    port: 5180,
    strictPort: true
  }
})
