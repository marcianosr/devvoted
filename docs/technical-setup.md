# Technical setup

Instructions to setup a codebase for _Next.js_ development in a monorepo, powered by _NX_.

## 1. Setup ASDF for tool management

```sh
brew install asdf
```

Follow the step from ["Install ASDF"](https://asdf-vm.com/guide/getting-started.html#_3-install-asdf) that matches your installer and shell: (probably: "ZSH & Homebrew", "Bash & Homebrew" or "Fish & Homebrew").

> ⚠ **Make sure you restart your terminal after this step**

```sh
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf install nodejs latest:20 # 20 could be another even numbered major release
```

## 2. Setup repo

```sh
git init my-app
cd my-app
asdf local nodejs latest:20 # use same major as above
corepack enable
nodejs reshim nodejs
yarn init -2 -w
echo "nodeLinker: node-modules" > .yarnrc.yml
yarn dlx nx@latest init
```

## 3. Creating a library for UI components

Including storybook

```sh
yarn dlx nx g @nx/react:lib ui
yarn nx add @nx/storybook
yarn nx g @nx/storybook:configuration ui # you can pick @storybook/react-vite as framework
yarn dlx storybook@latest upgrade # just to get to the latest before we start
```

you can now add the following to the scripts of the root _package.json_:

```json filename="package.json"
{
  "scripts": {
    "storybook": "nx run ui:storybook dev -p 9009"
  }
}
```

Guides for further setup:

- [Using Tailwind CSS in React and Next.js](https://nx.dev/recipes/react/using-tailwind-css-in-react#using-tailwind-css-in-react-and-nextjs)
- [Integrate Tailwind CSS and Storybook](https://storybook.js.org/recipes/tailwindcss)

## 4. Create a Next.js Application

```sh
nx add @nx/next
nx g @nx/next:app my-app-name
```
