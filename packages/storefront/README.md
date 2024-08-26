# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Project structure example

```mermaid
graph TD;
    A(src)
    A1(components)
    A2(pages)
    A3(styles)
    A4(types)
    A5(utils)
    A6(assets)

    subgraph src
        A --> A1
        A --> A2
        A --> A3
        A --> A4
        A --> A5
        A --> A6

        A1a(Navbar.astro)
        A1b(Header.astro)
        A1c(ProductCard.astro)
        A1d(ProductList.astro)
        A1e(CategoryList.astro)
        A1f(Cart.astro)

        A2a(index.astro)
        A2b(product.astro)
        A2c(category.astro)
        A2d(cart.astro)

        A3a(global.css)
        A3b(home.css)
        A3c(product.css)
        A3d(category.css)
        A3e(cart.css)

        A4a(types.ts)

        A5a(api.ts)
        A5b(formatters.ts)

        A6a(images)
        A6b(icons)

        A1 --> A1a
        A1 --> A1b
        A1 --> A1c
        A1 --> A1d
        A1 --> A1e
        A1 --> A1f

        A2 --> A2a
        A2 --> A2b
        A2 --> A2c
        A2 --> A2d

        A3 --> A3a
        A3 --> A3b
        A3 --> A3c
        A3 --> A3d
        A3 --> A3e

        A4 --> A4a

        A5 --> A5a
        A5 --> A5b

        A6 --> A6a
        A6 --> A6b
    end
```
