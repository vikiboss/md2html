import * as path from 'node:path'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkEmoji from 'remark-emoji'
import rehypeKatex from 'rehype-katex'
import remarkRehype from 'remark-rehype'
import remarkHeadingId from 'remark-heading-id'
import rehypeStringify from 'rehype-stringify'
import { remarkAlert } from 'remark-github-blockquote-alert'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'

const __dirname = import.meta.dirname || '.'

const glmCSS = (await Deno.readTextFile(path.join(__dirname, './css/glm.css'))).replace(/[\r\n]+/g, ' ')
const katexCSS = (await Deno.readTextFile(path.join(__dirname, './css/katex.css'))).replace(/[\r\n]+/g, ' ')
const globalCSS = (await Deno.readTextFile(path.join(__dirname, './css/global.css'))).replace(/[\r\n]+/g, ' ')
const linkSvg = await Deno.readTextFile(path.join(__dirname, './assets/link.svg'))

async function md2html(md: string, options: { title?: string } = {}): Promise<string> {
  const { title = '' } = options

  const enableKatex = md.includes('$$') || md.includes('\\(') || md.includes('\\[')
  const finalTitle = title || (md.match(/#+\s*(.+)\n?/)?.[1] || 'Readme').replace(/\s*\{#.+\}\s*/g, '').trim()

  const processor = unified()
    .use(remarkParse)
    .use(remarkEmoji, {
      accessible: true,
      padSpaceAfter: true,
    })
    .use(remarkHeadingId, {
      defaults: true,
      uniqueDefaults: true,
    })
    .use(remarkAlert, { legacyTitle: true })
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeAutolinkHeadings, {
      properties: { class: 'anchor' },
      content: fromHtmlIsomorphic(linkSvg).children as never,
    })
    .use(rehypeKatex)
    .use(rehypeRaw, { tagfilter: true })
    .use(rehypeStringify)

  const mainHTML = await processor.process(md)

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${finalTitle}</title>
    <style>
      body { margin: 2rem auto; background-color: var(--color-canvas-default); }
      main { max-width: 800px; margin: 0 auto; padding: 0 1rem; }
      ${globalCSS} ${glmCSS}
      ${enableKatex ? katexCSS : ''}
    </style>
  </head>
  <body class="markdown-body"><main>${mainHTML.toString()}</main></body>
</html>`
}

Deno.serve({ hostname: 'localhost', port: 3010 }, async (request: Request) => {
  const url = new URL(request.url)

  if (url.pathname === '/favicon.ico') fetch('https://avatar.viki.moe')

  const options = { title: url.searchParams.get('title') || '' }

  async function responseMarkdown(filename: string) {
    const html = await md2html(await Deno.readTextFile(path.join(__dirname, filename)))
    return new Response(html, { headers: { 'Content-Type': 'text/html' } })
  }

  if (url.pathname === '/preview') return responseMarkdown('./preview.md')

  if (!request.body) return responseMarkdown('./readme.md')

  return new Response(await md2html(await request.text(), options), { headers: { 'Content-Type': 'text/html' } })
})
