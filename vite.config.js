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
      server.middlewares.use('/api/proxy-image', async (req, res) => {
        const url = new URL(req.url, 'http://localhost')
        const targetUrl = url.searchParams.get('url')
        if (!targetUrl) {
          res.statusCode = 400
          res.end('Missing url parameter')
          return
        }

        try {
          const imgRes = await fetch(targetUrl)
          if (!imgRes.ok) {
            res.statusCode = imgRes.status
            res.end(`Target returned status: ${imgRes.statusText}`)
            return
          }

          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Content-Type', imgRes.headers.get('Content-Type') || 'image/jpeg')
          
          const buffer = await imgRes.arrayBuffer()
          res.end(Buffer.from(buffer))
        } catch (e) {
          console.error(e)
          res.statusCode = 500
          res.end(e.message || 'Internal Server Error')
        }
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

      server.middlewares.use('/api/imagekit-delete', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            const { fileUrl } = JSON.parse(body);
            if (!fileUrl) {
              res.statusCode = 400;
              res.end('fileUrl is required');
              return;
            }

            const privateKey = env.IMAGEKIT_PRIVATE_KEY;
            if (!privateKey) {
              res.statusCode = 500;
              res.end('IMAGEKIT_PRIVATE_KEY is not configured on the server.');
              return;
            }

            const urlObj = new URL(fileUrl);
            let path = urlObj.pathname;
            const parts = path.split('/').filter(Boolean);
            if (parts.length > 1 && (parts[0] === 'feu3swboqb' || parts[0] === urlObj.hostname.split('.')[0])) {
              path = '/' + parts.slice(1).join('/');
            } else {
              path = '/' + parts.join('/');
            }

            const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');
            const listRes = await fetch(`https://api.imagekit.io/v1/files?path=${path}`, {
              headers: { 'Authorization': authHeader }
            });

            if (!listRes.ok) {
              const text = await listRes.text();
              throw new Error(`Failed to list file: ${text}`);
            }

            const filesList = await listRes.json();
            if (filesList.length === 0) {
              res.statusCode = 404;
              res.end('File not found on ImageKit');
              return;
            }

            const fileId = filesList[0].fileId;
            const deleteRes = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
              method: 'DELETE',
              headers: { 'Authorization': authHeader }
            });

            if (!deleteRes.ok) {
              const text = await deleteRes.text();
              throw new Error(`Failed to delete file: ${text}`);
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (e) {
            console.error(e);
            res.statusCode = 500;
            res.end(e.message || 'Internal Server Error');
          }
        });
      });
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
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
      },
      dedupe: ['react', 'react-dom']
    },
    server: {
      port: 5180,
      strictPort: true
    }
  }
})
