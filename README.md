# Set up React + [Webpack](https://webpack.js.org) One Step at a Time

## Motivation

You can quickly create a React application using [create-react-app](https://github.com/facebookincubator/create-react-app). It's an amazing tool. But I want to understand the magic behind it. So I decided to try to replicate the "magic" one step at a time from zero using [webpack](https://webpack.js.org).

## Pre-requisites

1. Install [nvm](https://github.com/creationix/nvm). `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash`
2. Install the latest node. `nvm install node`
3. Create a `package.json` file. `npm init`

## Install React

Let's start installing [React](https://reactjs.org) by installing 2 npm packages, `react` and `react-dom`

```bash
npm install --save react react-dom
```

## Set up ES6 and JSX with Babel

To be able to write React application pleasantly, let's enable ES6 and JSX using [Babel](https://babeljs.io) by installing 2 npm packages, `babel-preset-react` and `babel-preset-env`.

```bash
npm install --save-dev babel-loader babel-core babel-cli babel-preset-react babel-preset-env
```

Then we create `.babelrc` file to configure Babel in the project:

```javascript
{
  "presets": ["env", "babel-preset-react"]
}
```

Let's test our setup first. Create a new file `index.js`:

```javascript
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<h1>Hello, world!</h1>, document.getElementById("root"));
```

Then run `npx babel index.js -d dist`. This command will compile `index.js` using babel and write the output to `dist` directory.

```shell
$ npx babel index.js -d dist
index.js -> dist/index.js
```

If nothing went wrong, you should see the following in `dist/index.js`

```javascript
"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

_reactDom2.default.render(
  _react2.default.createElement("h1", null, "Hello, world!"),
  document.getElementById("root")
);
```

## Set up Webpack

First install webpack:

```bash
npm install --save-dev webpack
```

Create webpack configuration file called `webpack.config.js` with content as follows

```javascript
const path = require("path");

module.exports = {
  entry: ["./index.js"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }]
  }
};
```

And then add a script in to build the application using webpack in `package.json`

```javascript
"scripts": {
    "build": "webpack --config webpack.config.js"
  }
```

Now let's try to build the application using webpack by running `npm run build`. You should see something like this.

```shell
$ npm run build

> react-webpack-steps@1.0.0 build /project
> webpack --config webpack.config.js

Hash: bc6785867b449a30422b
Version: webpack 3.10.0
Time: 943ms
    Asset    Size  Chunks                    Chunk Names
bundle.js  727 kB       0  [emitted]  [big]  main
  [14] multi ./index.js 28 bytes {0} [built]
  [15] ./index.js 410 bytes {0} [built]
    + 26 hidden modules
```

And a new file called `undle.js` in `dist` directory should be created.

## index.html

We have the bundled js file and now we need an html file. We can create one manually or we can use use a webpack plugin to create one for us automatically called HtmlWebpackPlugin.

```bash
npm install --save-dev html-webpack-plugin
```

Then add the plugin to `webpack.config.js`

```javascript
...
plugins: [
    new HtmlWebpackPlugin({
      title: "React Webpack",
      template: "public/index.html"
    })
  ],
...
```

Now we need to create a html file template in `public` directory called `index.html`

Before we try this new setup, let's add one more plugin to clean up the `dist` directory before webpack generates a new output.

```bash
npm install --save-dev clean-webpack-plugin
```

And add the plugin to the webpack configuration file.

```javascript
plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      title: "React Webpack",
      template: "public/index.html"
    })
  ],
```

Run `npm run build` again to test our setup so far.

```shell
$ npm run build

> react-webpack-steps@1.0.0 build /project
> webpack --config webpack.config.js

clean-webpack-plugin: /project/dist has been removed.
Hash: d1734ac6112893382def
Version: webpack 3.10.0
Time: 1179ms
     Asset       Size  Chunks                    Chunk Names
 bundle.js     727 kB       0  [emitted]  [big]  main
index.html  255 bytes          [emitted]
  [14] multi ./index.js 28 bytes {0} [built]
  [15] ./index.js 410 bytes {0} [built]
    + 26 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
       [0] ./node_modules/html-webpack-plugin/lib/loader.js!./public/index.html 627 bytes {0} [built]
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 1 hidden module
```

## serve

We can try to check the React application on the browser. Install [serve](https://github.com/zeit/serve).

```bash
npm i -g serve
```

Run the server.

```bash
$ serve -s dist

   ┌───────────────────────────────────────────────────┐
   │                                                   │
   │   Serving!                                        │
   │                                                   │
   │   - Local:            http://localhost:5000       │
   │   - On Your Network:  http://192.168.1.102:5000   │
   │                                                   │
   │   Copied local address to clipboard!              │
   │                                                   │
   └───────────────────────────────────────────────────┘
```

Now you can open your browser and go to `http://localhost:5000`. You should see a big text "Hello, world!"

## webpack-dev-server

To make us more productive in developing this React application, let's install a development server that will automatically reload the browser when we make any changes to the source files.

```bash
npm install --save-dev webpack-dev-server
```

Then configure the webpack-dev-server in `webpack.config.js`

```javascript
...
devServer: {
    contentBase: "./dist"
  },
...
```

And add another script in `package.json`

```javascript
...
"scripts": {
  ...
  "start": "webpack-dev-server --config webpack.config.js",
  ...
}
...
```

Run the development server: `npm run start`

```shell
npm run start

> react-webpack-steps@1.0.0 start /project
> webpack-dev-server --config webpack.config.js

clean-webpack-plugin: /project/dist has been removed.
Project is running at http://localhost:8080/
webpack output is served from /
Hash: 2c86cd16fcedb361101e
Version: webpack 3.10.0
Time: 2178ms
     Asset       Size  Chunks                    Chunk Names
 bundle.js    1.05 MB       0  [emitted]  [big]  main
index.html  255 bytes          [emitted]
   [4] ./node_modules/react/index.js 190 bytes {0} [built]
  [16] multi (webpack)-dev-server/client?http://localhost:8080 ./index.js 40 bytes {0} [built]
  [17] (webpack)-dev-server/client?http://localhost:8080 7.95 kB {0} [built]
  [18] ./node_modules/url/url.js 23.3 kB {0} [built]
  [25] ./node_modules/strip-ansi/index.js 161 bytes {0} [built]
  [26] ./node_modules/ansi-regex/index.js 135 bytes {0} [built]
  [27] ./node_modules/loglevel/lib/loglevel.js 7.86 kB {0} [built]
  [28] (webpack)-dev-server/client/socket.js 1.05 kB {0} [built]
  [30] (webpack)-dev-server/client/overlay.js 3.73 kB {0} [built]
  [31] ./node_modules/ansi-html/index.js 4.26 kB {0} [built]
  [32] ./node_modules/html-entities/index.js 231 bytes {0} [built]
  [35] (webpack)/hot nonrecursive ^\.\/log$ 170 bytes {0} [built]
  [37] (webpack)/hot/emitter.js 77 bytes {0} [built]
  [39] ./index.js 410 bytes {0} [built]
  [43] ./node_modules/react-dom/index.js 1.36 kB {0} [built]
    + 37 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
       [0] ./node_modules/html-webpack-plugin/lib/loader.js!./public/index.html 627 bytes {0} [built]
       [1] ./node_modules/lodash/lodash.js 540 kB {0} [built]
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
webpack: Compiled successfully.
```

Open your browser and go to `http://localhost:8080/`. You should see the Hello, World! text. Now change the text in `index.js`, then save. The text in the browser should change automatically.

```javascript
// index.js
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<h1>Hello, cool person!</h1>, document.getElementById("root"));
```

## Hot Module Replacement

Having the browser to reload automatically on file changes is cool. But what's even cooler is to be able to reload only the part that is actually changed, a.k.a [Hot Module Replacement (HMR)](https://webpack.js.org/concepts/hot-module-replacement/). Let's add more stuff to the React application.

```javascript
// Header.js
import React, { Component } from "react";

class Header extends Component {
  render() {
    return <h1>This is a header yo</h1>;
  }
}

export default Header;
```

```javascript
// App.js
import React, { Component } from "react";
import Header from "./components/Header";

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <p>This is body part</p>
      </div>
    );
  }
}

export default App;
```

```javascript
// index.js

import React from "react";
import ReactDOM from "react-dom";
import App from "./src/App";

ReactDOM.render(<App />, document.getElementById("root"));
```

We have 3 files now. `index.js` where we render the application. `App.js` is the root component of the application. `Header.js` is the header component of the app. If we made some changes to `Header.js` for example, the browser will automatically reload the page. With HMR, only the header part will be updated.

1. First, we need to install [react-hot-loader](https://github.com/gaearon/react-hot-loader).

```shell
npm i --save react-hot-loader
```

2. Then we need to make some changes in `webpack.config.js` file:

* Add `"react-hot-loader/patch"` at the beginning of `entry` key.
* Add `hot: true` to `devServer` key.
* Add webpack HMR plugin.

```javascript
...
entry: ["react-hot-loader/patch", "./index.js"],
devServer: {
  contentBase: "./dist",
  hot: true // enable HMR
},
plugins: [
  new CleanWebpackPlugin(["dist"]), // to clean the dist-ui folder
  new HtmlWebpackPlugin({
    title: "React Webpack",
    template: "public/index.html"
  }), // to create index.html automatically from template
  new webpack.HotModuleReplacementPlugin()
],
```

3. We also need to configure babel:

* Add `"react-hot-loader/babel"` plugin to `.babelrc`
* Disable the modules of babel-preset-env in `.babelrc`

```javascript
{
  "presets": [["env", { "modules": false }], "babel-preset-react"],
  "plugins": ["react-hot-loader/babel"]
}
```

4. Tweak `index.js` to enable HMR.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import App from "./src/App";

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById("root")
  );
};

render(App);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./src/App", () => {
    render(App);
  });
}
```

That's it. Stop the development server (CTRL+C) then re-run it. Open the browser and the Console window (Developer Tool in Chrome). You should see that HMR has been enabled. Try changing the Header component or App component. The browser should not reload but the component should be updated.

```
[HMR] Waiting for update signal from WDS...
[WDS] Hot Module Replacement enabled.
[WDS] App updated. Recompiling...
[WDS] App hot update...
[HMR] Checking for updates on the server...
[HMR] Updated modules:
[HMR]  - 222
[HMR]  - 35
[HMR] Consider using the NamedModulesPlugin for module names.
[HMR] App is up to date.
```

Let's add `NamedModulesPlugin` as suggested in the Console output. Modify the `webpack.config.js` with

```javascript
...
plugins: [
  new CleanWebpackPlugin(["dist"]), // to clean the dist-ui folder
  new HtmlWebpackPlugin({
    title: "React Webpack",
    template: "public/index.html"
  }), // to create index.html automatically from template
  new webpack.NamedModulesPlugin(), // to show the name of updated modules in Console
  new webpack.HotModuleReplacementPlugin() // enable HMR
],
...
```

Re-run the development server. Now when you make some changes, we can see the name of the module which is updated in the browser's console.

```
[WDS] App hot update...
[HMR] Checking for updates on the server...
[HMR] Updated modules:
[HMR]  - ./src/App.js
[HMR] App is up to date.
```
