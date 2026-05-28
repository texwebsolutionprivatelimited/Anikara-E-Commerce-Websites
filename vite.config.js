import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { createHmac, randomUUID } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function devServerModuleImportFixes(env) {
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

      server.middlewares.use('/api/imagekit-auth', (_req, res) => {
        const privateKey = env.IMAGEKIT_PRIVATE_KEY

        if (!privateKey) {
          res.statusCode = 500
          res.end('IMAGEKIT_PRIVATE_KEY is not configured on the server.')
          return
        }

        const token = randomUUID()
        const expire = Math.floor(Date.now() / 1000) + 1200
        const signature = createHmac('sha1', privateKey)
          .update(token + expire)
          .digest('hex')

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ signature, token, expire }))
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  return {
    plugins: [
      devServerModuleImportFixes(env),
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
  }
})
