# Devvoted

A fresh 🆕 poll app will come here, keep an eye on this repo as code will appear!

## Development Setup

### Setup NodeJS (JavaScript runtime)

1. Install [asdf](https://asdf-vm.com/): `brew install asdf`
2. Install the _nodejs_ plugin: `asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git`
3. Check project version of node: `cat .tool-versions`
4. Install [nodejs](https://nodejs.org/en): `asdf install nodejs <version>`

### Setup Yarn (package manager)

You need [Yarn](https://yarnpkg.com/getting-started/install) 4+:

```
corepack enable
asdf reshim nodejs
```

### Install dependencies

```
yarn install
```

## Running application (for development)

```sh
yarn dev
```

## Viewing components

You can view the styled components through storybook:

```sh
yarn storybook:ui
```
