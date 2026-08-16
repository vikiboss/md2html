# Markdown Render Preview

# Heading 1

Main content. **Bold** *Italic* [Link](https://example.com) `Code`

![Image](https://blog.viki.moe/favicon.ico)

## Heading 2

### Heading 3 with Custom Anchor Id {#custom-id}

#### Heading 4

##### Heading 5

###### Heading 6

## Task List

- [x] Task 1
- [ ] Task 2
- [ ] Task 3

## Emoji Transform

Emoji Text => `:smile: :+1: :rocket:` => :smile: :+1: :rocket:

Emoji Unicode => 😄 👍 🚀

## Table

### Normal Table

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

### Align Table

| Header 1 | Header 2 | Header 3 |
| :------: | :------: | :------: |
|  Center  |  Center  |  Center  |
|  Cell 1  |  Cell 2  |  Cell 3  |

## Autolink

Plain URL text: `https://example.com` => https://example.com

## Math

$$
L = \frac{1}{2} \rho v^2 S C_L
$$

$$
\begin{aligned}
\dot{x} & = \sigma(y-x) \\
\dot{y} & = \rho x - y - xz \\
\dot{z} & = -\beta z + xy
\end{aligned}
$$

## GitHub Styled Alert

> [!NOTE]  
> Highlights information that users should take into account, even when skimming.

> [!TIP/提示]
> Optional information to help a user be more successful.
>
> With Custom Title

> [!IMPORTANT]  
> Crucial information necessary for users to succeed.

> [!WARNING]  
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

## Code Block (Powered by [Shiki](https://shiki.style/))

### Normal Code (with Highlight Lines)

```tsx {4,8-9}
import { useState } from 'react';

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### With Focus

```jsx
import { useState } from 'react';

export function App() {
  const [count, setCount] = useState(0); // [!code focus]

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### Diff Language

```diff
+ const a = 1;
- const b = 2;
```

## Limited HTML Tags Support

<details>
  <summary>Click to expand!</summary>
  Content inside details
</details>

<img src="https://avatar.viki.moe" alt="Avatar" width="100" height="100" style="border-radius: 12%;">

<div style="display: flex; gap: 8px;">
  <span style="color: tomato;">Tomato Text</span><span style="color: lime;">Lime Text</span><span style="color: skyblue;">Skyblue Text</span>
</div>

## Footnote

This is a footnote[^1].

[^1]: Footnote Content

