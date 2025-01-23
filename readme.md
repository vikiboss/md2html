# md2html

A service that converts Markdown to beautiful HTML. Support full-featured syntax。See the [Render Preview](https://md-to-html.deno.dev/preview).

> [!TIP]
> This service is powered by [Deno](https://deno.land/) & [Deno Deploy](https://deno.com/deploy).

## Usage

```ts
fetch('https://md-to-html.deno.dev', {
  method: 'POST',
  body: '## Hello, World!',
}).then((res) => res.text());
```

## Features

- [GitHub Flavored Markdown](https://github.github.com/gfm/) (GFM) 
  - Emoji Transform: `:smile:` -> 😄
  - Autolink: `https://example.com` -> `<a href="https://example.com">https://example.com</a>`
  - Code Block: ``` ``` -> code block
  - Table: `| header | header |` -> table
  - Task List: `- [x]` -> checked, `- [ ]` -> unchecked
- [GitHub Styled Alert](https://github.com/orgs/community/discussions/16925)
  - `> [!INFO]` -> info alert 
  - `> [!TIP]` -> tip alert
  - `> [!IMPORTANT]` -> important alert
  - `> [!WARNING]` -> warning alert
  - `> [!CAUTION]` -> caution alert
- [KaTeX](https://katex.org/) (Math expressions)
  - `$$ ... $$`: display math
  - `\[ ... \]`: display math
  - `$ ... $`: inline math
- Code Block Powered by [Shiki](https://shiki.style/)  (The Modern Beautiful Syntax Highlighter)
  - Support many languages and beautiful themes
  - Useful Notations (available in this service):
    - `transformerNotationDiff()`: like: `+const a = 1`
    - `transformerNotationFocus()`: like: `// [!code focus]`
    - `transformerMetaHighlight()`: like: ```js {1,3-5}
    - `transformerMetaWordHighlight()`: like: ```js /Hello/
    - `transformerNotationHighlight()`: like: `// [!code highlight]`
    - `transformerNotationErrorLevel()`: like: `[!code error] & [!code warning]`
    - `transformerNotationWordHighlight()`: like: `// [!code word:Hello]`
- Heading Anchor
  - a link icon on the right of the heading when hover
- Footnote
  - `[^1]: Footnote Content`

## Render Preview

See the [Render Preview](https://md-to-html.deno.dev/preview).

## License

[MIT](./LICENSE) License © 2025-PRESENT Viki
