# Introduction

An example application showcasing LUIS use as catalogue.
Tests are executed in the browser, as well as snapshots.

*WARNING: The CI can be delivered via mocha and chai-match-snapshot but browser snapshots can vary from snapshots generated on server. If you do not care about CI, do not worry.*

# How to use Luis catalogue in your app

1. Install dependencies with:

   ```js
   yarn add react react-dom // if you do not have react app add it to dev
   yarn add luis luis-browser fuse-box --dev

   // optional dependencies for writing tests
   yarn add chai --dev

   // optional dependencies for typescript
   yarn add @types/react @types/chai --dev
   ```
2. Define your tests and run the luis app in your entry file
3. Add `fuse.js` to run Luis with fuse-box

# Example Configuration

## Entry File

Here you need to link all your tests, so that fuse-box and luis can pick them up. Use `storyOf` to define your story. Check out the documentation of [luis](https://github.com/tomitrescak/luis) for full description of API.

```js
// src/index.ts
import * as React from 'react';

import { setupLuisBridge } from 'luis-jest-bridge';
import { renderLuis } from 'luis';
import { expect } from 'jest';

// setup browser bridge, which will allow to execute simple tests and stories in browser
setupLuisBridge();

// you can either write your tests here or import them from other test files
// e.g. import 'path/to/my/test'

// simple component with no tests
storyOf(
  'Input',
  () => <div>My Component</div>
);

// component with tests
storyOf(
  'Component With Test',
  {
    foo: 2,
    bar: 3,
    get component() { // just another notation
      return <div>My Tested</div>;
    }
  },
  data => {
    it('passes', () => {
      expect(data.foo).to.equal(2);
    });

    it('fails', () => {
      expect(data.bar).to.equal(2);
    });
  }
);


renderLuis();
```

## Setup Fuse-box

Following is a config file for Fuse-Box.
First, it may seem a bit overwhelming but it is pretty straightforward and well documented. 

```js
const { FuseBox,  CSSPlugin, CSSResourcePlugin,  WebIndexPlugin } = require('fuse-box');

// init fusebox and plugins

const luisFuse = FuseBox.init({
  homeDir: 'src',
  emitHMRDependencies: true,
  output: 'public/$name.js',
  plugins: [
    [
      CSSResourcePlugin(),
      CSSPlugin({
        group: 'luis.css',
        outFile: `public/luis.css`,
        inject: false
      })
    ],
    WebIndexPlugin({ template: 'src/index.html', target: 'index.html' })
  ]
});

// init dev server

const historyAPIFallback = require('connect-history-api-fallback');
luisFuse.dev({ port: 3000 }, server => {
  const app = server.httpServer.app;
  app.use(historyAPIFallback());
});

// split bundle between vendor and client

luisFuse
  .bundle('luis-vendor')
  .target('browser')
  .instructions(' ~ src/index.tsx'); 

luisFuse
  .bundle('luis-client')
  .watch() 
  .hmr()
  .target('browser@es6')
  .sourceMaps(true)
  .instructions(' !> [src/index.tsx]'); 

luisFuse.run();
```
