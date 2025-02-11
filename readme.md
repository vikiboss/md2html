# md2html (Markdown (GFM) to HTML API)

> [!NOTE]
> This project is under active development. Feel free to [open an issue](https://github.com/vikiboss/md2html/issues) for bugs or feature requests.

A powerful **md2html** (Markdown to HTML) converter service that transforms your Markdown content (GFM) into beautiful, feature-rich HTML. Built with modern technologies and support for advanced syntax features.

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install

# Start development server
npm run dev
```

### Basic Usage

```typescript
// Client-side usage
const response = await fetch('https://localhost:3000', {
  method: 'POST',
  headers: {
    'Content-Type': 'text/markdown'
  },
  body: '## Hello, World!'
});

const html = await response.text();
```

## ✨ Features

### Core Markdown Support
- **Complete [GitHub Flavored Markdown](https://github.github.com/gfm/) (GFM)**
  - Emoji Shortcodes: `:smile:` → 😄
  - Smart Autolinks: URLs automatically convert to clickable links
  - Syntax-highlighted Code Blocks
  - Tables with alignment options
  - Task Lists: `- [x]` (checked) and `- [ ]` (unchecked)
  - Strikethrough: `~~text~~`
  - Extended Table Features

### Enhanced Formatting

#### GitHub-Style Alerts

> [!NOTE]
> This is a note

> [!TIP]
> This is a helpful tip

> [!IMPORTANT]
> Critical information

> [!WARNING]
> Warning message

> [!CAUTION]
> Proceed with caution

```markdown
> [!NOTE]
> This is a note

> [!TIP]
> This is a helpful tip

> [!IMPORTANT]
> Critical information

> [!WARNING]
> Warning message

> [!CAUTION]
> Proceed with caution
```

#### Mathematical Expressions (KaTeX)

- Display Math: `$$ ... $$` or `\[ ... \]`
- Inline Math: `$ ... $`
- Supports complex mathematical notations and equations
- Fast rendering with KaTeX

#### Advanced Code Blocks

Powered by [Shiki](https://shiki.style/), featuring:

- Rich syntax highlighting for 100+ languages
- Multiple beautiful themes
- Special annotations:
  
```typescript
function hello() {
  console.log('Hello World!'); // [!code focus]
}
```
  
Advanced notation support:

- Diff highlighting: `+` for additions, `-` for deletions
- Line focusing: `// [!code focus]`
- Line highlighting: `{1,3-5}`
- Word highlighting: `/pattern/`
- Error/Warning levels: `[!code error]`, `[!code warning]`

### Additional Features

- **Heading Anchors**: Automatically generated, hoverable link icons
- **Footnotes**: Support for reference-style footnotes
- **Table of Contents**: Auto-generated based on headings
- **Responsive Design**: Looks great on all devices
- **Custom Containers**: For special content blocks
- **Image Optimization**: Lazy loading and size optimization

## 📄 License

[MIT](./license) License © 2025-PRESENT Viki
