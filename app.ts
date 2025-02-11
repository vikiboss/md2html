import fs from 'node:fs'
import Koa from 'koa'
import path from 'node:path'
import { bodyParser } from '@koa/bodyparser'
import { md2html } from './md2html.ts'

const readme = fs.readFileSync(path.join(import.meta.dirname, './readme.md'), 'utf8')
const preview = fs.readFileSync(path.join(import.meta.dirname, './preview.md'), 'utf8')

const app = new Koa()

app.use(
  bodyParser({
    encoding: 'utf8',
    enableTypes: ['text', 'json'],
  })
)

app.use(async ctx => {
  const url = new URL(ctx.url, 'http://localhost')
  const qs = new URLSearchParams(ctx.querystring)
  const text =
    url.pathname === '/preview' ? preview : ctx.request.body || `${readme}\n\n---\n\n${preview}`

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
