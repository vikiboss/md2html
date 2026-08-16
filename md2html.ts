import fs from 'node:fs'

import { unified } from 'unified'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'

import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkEmoji from 'remark-emoji'
import remarkRehype from 'remark-rehype'
import remarkHeadingId from 'remark-heading-id'
import { remarkAlert } from 'remark-github-blockquote-alert'

import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

import { config } from './config.ts'

const glmCSS = fs.readFileSync('./css/glm.css', 'utf8').replace(/[\r\n]/g, '')
const katexCSS = fs.readFileSync('./css/katex.css', 'utf8').replace(/[\r\n]/g, '')
const globalCSS = fs.readFileSync('./css/global.css', 'utf8').replace(/[\r\n]/g, '')
const shikiCSS = fs.readFileSync('./css/shiki.css', 'utf8').replace(/[\r\n]/g, '')
const linkSvg = fs.readFileSync('./assets/link.svg', 'utf8')

interface Md2htmlOptions {
  title?: string
  color?: 'dark' | 'light' | 'auto'
  darkTheme?: string
  lightTheme?: string
  defaultColor?: string
  lineNumbers?: boolean
}

export async function md2html(md: string, options: Md2htmlOptions = {}): Promise<string> {
  const {
    title = '',
    color = 'auto',
    lineNumbers = false,
    darkTheme = config.darkTheme,
    lightTheme = config.lightTheme,
    defaultColor = config.defaultColor,
  } = options

  const enableKaTex = md.includes('$$') || md.includes('\\(') || md.includes('\\[')
  const finalTitle = title || (md.match(/#+\s*(.+)\n?/)?.[1] || 'md2html').replace(/\s*\{#.+\}\s*/g, '').trim()

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
    .use(rehypeShiki, {
      defaultColor,
      themes: {
        dark: darkTheme,
        light: lightTheme,
      },
    })
    .use(rehypeAutolinkHeadings, {
      properties: {
        class: 'anchor',
      },
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
      body { margin: 2rem auto; }
      main { max-width: 800px; margin: 0 auto; padding: 1rem; }
      ${globalCSS}
      ${glmCSS}
      ${enableKaTex ? katexCSS : ''}
      ${shikiCSS}
      ${
        lineNumbers
          ? `
      pre.shiki code {
        counter-reset: step;
        counter-increment: step 0;
      }

      pre.shiki code .line::before {
        content: counter(step);
        counter-increment: step;
        min-width: 1rem;
        margin-right: 0.8rem;
        display: inline-block;
        text-align: right;
        color: rgba(115, 138, 148, 0.4) !important;
      }
      `
          : ''
      }
      </style>
      </head>
  <body class="markdown-body">
    <main>${mainHTML.toString()}</main>
    <script>
      ${
        color === 'auto'
          ? `
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(e.matches ? 'dark' : 'light');
          });

          const colorSchema = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';`
          : color === 'dark'
            ? `const colorSchema = 'dark';`
            : `const colorSchema = 'light';`
      }
      document.documentElement.classList.add(colorSchema);
    </script>
  </body>
</html>`
}
