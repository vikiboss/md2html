// @ts-ignore
import { httpServerHandler } from 'cloudflare:node'

import('./app.ts')

const port = process.env.PORT || 3000

export default httpServerHandler({ port })
