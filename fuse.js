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
  .instructions(' ~ index.tsx'); // nothing has changed here

luisFuse
  .bundle('luis-client')
  .watch() // watch only client related code
  .hmr()
  .target('browser@es6')
  .sourceMaps(true)
  .instructions(' !> [index.tsx]'); // + **/**.json

luisFuse.run();
