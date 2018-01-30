// src/index.ts
import * as React from 'react';

import { setupBrowserBridge } from 'luis-browser';

import { renderLuis } from 'luis';
import { expect } from 'chai';

// setup browser bridge, which will allow to execute simple tests and stories in browser
setupBrowserBridge();

// you can either write your tests here or import them from other test files
// e.g. import 'path/to/my/test'

storyOf(
  'Input',
  () => <div>My Component</div>
);

// you can group tests using BDD approach, with each describe generating one folder in 
describe('Folder', function() {
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

  storyOf(
    'Other Component',
    {
      get component() {
        return <div>Other Component</div>;
      }
    }
  );
})

renderLuis();