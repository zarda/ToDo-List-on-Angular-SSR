import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import compression from 'compression'

const serverDistFolder = dirname(fileURLToPath(import.meta.url))
const browserDistFolder = resolve(serverDistFolder, '../browser')

const app = express()
const angularApp = new AngularNodeAppEngine()

/**
 * Enable gzip/brotli compression for all responses
 * Reduces bandwidth usage by 60-80% for text-based assets
 */
app.use(compression({
	filter: (req: express.Request, res: express.Response) => {
		if (req.headers['x-no-compression']) {
			return false
		}
		return compression.filter(req, res)
	},
	level: 6 // Balance between compression ratio and CPU usage
}))

/**
 * Serve static files from /browser
 */
app.use(
	express.static(browserDistFolder, {
		maxAge: '1y',
		index: false,
		redirect: false
	})
)

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
	angularApp
		.handle(req)
		.then((response) =>
			response ? writeResponseToNodeResponse(response, res) : next(),
		)
		.catch(next)
})

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
	const port = Number(process.env['PORT']) || 8080
  const host = process.env['HOST'] || '0.0.0.0'
	app.listen(port, host, () => {
		console.log(`Node Express server listening on http://${host}:${port}`)
	})
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export default createNodeRequestHandler(app)