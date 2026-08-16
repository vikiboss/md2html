// @ts-ignore
import { httpServerHandler } from 'cloudflare:node'

import './app.ts'

export default httpServerHandler({
  port: process.env.PORT || 3000,
})
