# React UI

[<img src="https://codecov.io/gh/psychobolt/vite-storybook-boilerplate/branch/main/graph/badge.svg?component-id=react-ui">](https://codecov.io/gh/psychobolt/vite-storybook-boilerplate/tree/main/packages/react-ui)

UI Components used for the [next-app demo](https://github.com/psychobolt/vite-storybook-boilerplate/tree/main/apps/next-app).

Powered by:

- [html-ui](https://github.com/psychobolt/vite-storybook-boilerplate/tree/main/packages/html-ui)
- [React](https://react.dev)
- [Storybook React Docs](https://storybook.js.org/docs/react/writing-docs/introduction) with CSS Module support [typescript-plugin-css-modules](https://github.com/mrmckeb/typescript-plugin-css-modules)

## Install

```sh
yarn [workspace workspace-name] add [-D[E]] @psychobolt/html-ui @psychobolt/react-ui
```

## Usage

```jsx
// Component.jsx
// import '@psychobolt/react-ui/style.css';
// or
import '@psychobolt/react-ui/ComponentA.css';
import '@psychobolt/react-ui/ComponentB.css';

import React from 'react';
// import { ComponentA, ComponentB } from '@psychobolt/react-ui';
// or
import { ComponentA } from '@psychobolt/react-ui/ComponentA';
import { ComponentB } from '@psychobolt/react-ui/ComponentB';

export const Component = ({ label = 'Default Text' }) => (
  <ComponentA>
    <ComponentB>{label}</ComponentB>
  </ComponentB>
);
```

## API

See main Storybook [docs](https://main--642f33339c5eee1cdf95b318.chromatic.com/?path=/docs/readme--docs)
