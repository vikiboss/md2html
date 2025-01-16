import * as fs from 'node:fs'
import * as path from 'node:path'
import rehypeShiki from '@shikijs/rehype'
import { remarkAlert } from 'remark-github-blockquote-alert'
import { unified } from 'unified'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkEmoji from 'remark-emoji'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkHeadingId from 'remark-heading-id'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import remarkRehype from 'remark-rehype'
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerMetaHighlight,
  transformerNotationHighlight,
  transformerMetaWordHighlight,
  transformerCompactLineOptions,
  transformerNotationErrorLevel,
  transformerNotationWordHighlight,
} from '@shikijs/transformers'

const __dirname = import.meta.dirname
const opts = { encoding: 'utf-8' } as const
const glmCSS = fs.readFileSync(path.join(__dirname, './css/glm.css'), opts).replace(/[\r\n]+/g, ' ')
const katexCSS = fs.readFileSync(path.join(__dirname, './css/katex.css'), opts).replace(/[\r\n]+/g, ' ')
const ghAlertCSS = fs.readFileSync(path.join(__dirname, './css/gh-alert.css'), opts).replace(/[\r\n]+/g, ' ')
const shikiCSS = fs.readFileSync(path.join(__dirname, './css/shiki.css'), opts).replace(/[\r\n]+/g, ' ')
const globalCSS = fs.readFileSync(path.join(__dirname, './css/global.css'), opts).replace(/[\r\n]+/g, ' ')
const linkSvg = fs.readFileSync(path.join(__dirname, './assets/link.svg'), opts)

console.time('Preheated')

md2html('## Preheated\n\n```js\nconsole.log(123)\n```').then(() => {
  console.timeEnd('Preheated')
})

async function md2html(
  md: string,
  options: {
    title?: string
    colorMode?: 'auto' | 'light' | 'dark'
    shikiDarkTheme?: string
    shikiLightTheme?: string
  } = {}
): Promise<string> {
  const { title = '', colorMode = 'auto', shikiDarkTheme = 'one-dark-pro', shikiLightTheme = 'one-light' } = options

  const enableShiki = md.includes('```')
  const enableKatex = md.includes('$$') || md.includes('\\(') || md.includes('\\[')
  const enableGhAlert = md.includes('> [!')
  const finalTitle = title || (md.match(/#+\s*(.+)\n?/)?.[1] || 'Readme').replace(/\s*\{#.+\}\s*/g, '').trim()

  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkEmoji, {
      accessible: true,
      padSpaceAfter: true,
    })
    .use(remarkHeadingId, {
      defaults: true,
      uniqueDefaults: true,
    })
    .use(remarkAlert, {
      legacyTitle: true,
    })
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeAutolinkHeadings, {
      properties: { class: 'anchor' },
      content: fromHtmlIsomorphic(linkSvg).children as never,
    })
    .use(rehypeShiki, {
      defaultColor: 'light',
      themes: {
        dark: shikiDarkTheme,
        light: shikiLightTheme,
      },
      transformers: [
        transformerNotationDiff(), // like: +const a = 1
        transformerNotationFocus(), // like: // [!code focus]
        transformerMetaHighlight(), // like: ```js {1,3-5}
        transformerMetaWordHighlight(), // like: ```js /Hello/
        transformerNotationHighlight(), // like: // [!code highlight]
        transformerCompactLineOptions(), // shiki lineOptions
        transformerNotationErrorLevel(), // like: [!code error] & [!code warning]
        transformerNotationWordHighlight(), // like: // [!code word:Hello]
      ],
    })
    .use(rehypeKatex)
    .use(rehypeRaw, {
      tagfilter: true,
    })
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
      main { max-width: 800px; margin: 0 auto; }
      ${globalCSS}
      ${glmCSS}
      ${enableKatex ? katexCSS : ''}
      ${enableGhAlert ? ghAlertCSS : ''}
      ${enableShiki ? shikiCSS : ''}
    </style>
  </head>
  <body class="markdown-body">
    <main data-color-mode="${colorMode}" data-light-theme="light" data-dark-theme="dark">
      ${mainHTML.toString()}
    </main>
  </body>
</html>`
}

Deno.serve({ hostname: 'localhost', port: 3010 }, async (request: Request) => {
  const url = new URL(request.url)

  if (url.pathname === '/favicon.ico') {
    return new Response(null)
  }

  if (url.pathname === '/preview') {
    return new Response(await md2html(await Deno.readTextFile(path.join(__dirname, './preview.md'))), {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  if (!request.body) {
    return new Response(await md2html(await Deno.readTextFile(path.join(__dirname, './readme.md'))), {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  const title = new URL(request.url).searchParams.get('title') || ''
  return new Response(await md2html(await request.text(), { title }), { headers: { 'Content-Type': 'text/html' } })
})
