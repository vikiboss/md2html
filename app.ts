import Koa from 'koa'
import { md2html } from './md2html.ts'
import { bodyParser } from '@koa/bodyparser'

const readme = '# 123'
const preview = '# 456'

export const app = new Koa()

app.use(
  bodyParser({
    encoding: 'utf8',
    enableTypes: ['text', 'json'],
  }),
)

app.use(async (ctx) => {
  const url = new URL(ctx.url, 'http://localhost')
  const qs = new URLSearchParams(ctx.querystring)
  const isPreview = url.pathname === '/preview'
  const body = ctx.request.body as string
  const text = isPreview ? preview : body || `${readme}\n\n---\n\n${preview}`

  ctx.type = 'text/html'

  ctx.body = await md2html(text, {
    title: qs.get('title') || '',
    color: (qs.get('color') || 'auto') as 'dark' | 'light' | 'auto',
    darkTheme: qs.get('darkTheme') || undefined,
    lightTheme: qs.get('lightTheme') || undefined,
    defaultColor: qs.get('defaultColor') || undefined,
    lineNumbers: qs.get('lineNumbers') === 'true',
  })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)

  const now = performance.now()
  md2html(preview).then(() => {
    const elapsed = performance.now() - now
    console.log('> Preheat done, server ready, elapsed:', elapsed.toFixed(2), 'ms')
  })
})

// @ts-ignore
import { httpServerHandler } from 'cloudflare:node'
export default httpServerHandler({ port })
