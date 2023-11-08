# React UI

[<img src="https://codecov.io/gh/psychobolt/vite-storybook-boilerplate/branch/main/graph/badge.svg?flag=react-ui">](https://codecov.io/gh/psychobolt/vite-storybook-boilerplate/tree/main/packages/react-ui)

UI Components used for the [next-app demo](https://github.com/psychobolt/vite-storybook-boilerplate/tree/main/apps/next-app).

Powered by:

- [html-ui](https://github.com/psychobolt/vite-storybook-boilerplate/tree/main/packages/html-ui)
- [React](https://react.dev)
- [Storybook React Docs](https://storybook.js.org/docs/react/writing-docs/introduction) with CSS Module support [typescript-plugin-css-modules](https://github.com/mrmckeb/typescript-plugin-css-modules)

## Install

```sh
yarn [workspace workspace-name] add [-D][E] react-ui
```

## Usage

```JSX
import "react-ui/style.css"

import React from "react";
import { ComponentA, ComponentB } from "react-ui";

export const Component = ({ label = "Default Text" }) => (
  <ComponentA>
    <ComponentB>{label}</ComponentB>
  </ComponentB>
);
```

## API

See [Docs](https://main--642f33339c5eee1cdf95b318.chromatic.com/?path=/docs/readme--docs)
