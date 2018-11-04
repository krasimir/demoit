![demoit](./demoit.png)

# **Demoit** is a small tool for live coding exercises <!-- omit in toc -->

* Dependency free.
* No installation. Just copy/paste and open in a browser.
* No server needed.
* Uses Babel 6.26.0 to transpile your code.
* Supports React
* Supports multiple demos with multiple code snippets.

:rocket: Check the demo here [https://krasimir.github.io/demoit/](https://krasimir.github.io/demoit/). :rocket:

---

## Installation

Just clone/download this repository and open `index.html` in a browser.

## Configuration

The tool requires a `settings.json` file in the same directory as the `index.html` file. Here is an example:

```json
{
  "editor": {
    "theme": "material",
    "fontSize": "20px",
    "lineHeight": "28px"
  },
  "output": {
    "backgroundColor": "#c7e2e5",
    "fontSize": "1em",
    "lineHeight": "1.2em"
  },
  "resources": [
    "./resources/babel-6.26.0.js",
    "./resources/babel-polyfill@6.26.0.js",
    "./resources/react-16.7.0-alpha.0.js",
    "./resources/react-dom.16.7.0-alpha.0.js",
    "./resources/transforms.js",
    "./demos/demo-styles.css"
  ],
  "demos": [
    {
      "snippets": [
        "./demos/01/useHooks.js",
        "./demos/01/HoC.js",
        "./demos/01/FaCC.js"
      ],
      "transform": "babelToReact"
    }
  ]
}
```

* `editor` - settings for the right side of the screen - the editor.
  * `theme` - Demoit uses CodeMirror as an editor so here you can place some of its build-in themes. Check them out [here](https://codemirror.net/demo/theme.html).
  * `fontSize` - self explanatory
  * `lineHeight` - self explanatory
* `output` - settings for the left side of the screen
  * `backgroundColor` - self explanatory
  * `fontSize` - self explanatory
  * `lineHeight` - self explanatory
* `resources` - an array of files that your demo needs. This could be JavaScript or CSS files. They may be local or not. Demoit will fetch those first before running your demo files. The resources in the example above are coming with the library because you probably want to use them anyway. You probably want to write ES6+ and maybe plan to use React.
* `demos` - probably the most interesting part and the bit which you'll touch the most. It contains an array of items representing your demos. Every item has `snippets` and `transform` properties. The first one contains list of files which are your code snippets. The `transform` field points to a function in the global scope (i.e. `window` object) that Demoit uses when running your snippet. The one used above is part of the `resources/transforms.js` file which we listed as a resource to be included. The available values for now are `babelToCode`, `babelToConsole` and `babelToReact`.

## Transformations

When you register a code snippet Demoit runs a transformation function before executing your code. This is the place where we have to transpile or do some other operation to get our code properly running. The transformation function is listed in `settings.json` as a string and must be available in the global scope of the page. There are couple of build-in ones as part of `resources/transform.js`:

* `babelToCode` - transpiles the code and shows the transpiled string. It is not actually running the code.
* `babelToConsole` - same as `babelToCode` but it runs the code and it shows all the `console.log`s.
* `babelToReact` - it transpiles the code snippet and mounts an `<App>` component in the left section of the screen. To have this working there must be an `<App>` component defined.

Let's see some pseudo code based on the real `babelToReact` implementation and see what it does:

```js
function babelToReact(str) {
  const babelOptions = {
    presets: [ "react", ["es2015", { "modules": false }]]
  }
  const renderAppComponent = `
    // ... a check if we have <App> component
    const output =  document.querySelector('.output');
    ReactDOM.render(React.createElement(App, null), document.querySelector('.output'));
  `;
  let code = Babel.transform(str, babelOptions).code;
  let func = new Function(code + renderAppComponent);

  func();
}
```

The input of the transformation function is a raw string. That's the code that write on the right side of the screen. If the function returns HTML that HTML gets placed on left section. That section has a CSS class `output` so we may directly write something there. As it happens with `babelToReact`. We have no HTML string returned but we use `ReactDOM.render` to add content on the same place. In order to dynamically execute our code we form a valid JavaScript expression and pass it to the `Function` constructor. Then we execute it. At the moment of `func()` we have to have all the resources loaded and the page needs to have all the dependencies that our code needs.

## Key combinations

There is only one key combination - `Ctrl + S`/`Cmd + S` which is basically triggering the transformation and execution of our code.

## UI

There is really not much to say here. There are two buttons of the lower left side of the tool. The first one shows a menu with all of our demos and code snippets in them. The second button becomes solid black if there are unsaved changes to our code. It also works as a button for saving but I guess clicking `Ctrl + S` or `Cmd + S` is quicker.

## Troubleshooting

### Error `URL scheme must be "http" or "https" for CORS request.`

It means that the browser doesn't load the files that the tool needs because the protocol is `file://`. That's a problem in Chrome at the moment. Everything works fine in Firefox. To fix the problem in Chrome you have to run it like so:

```
open /Applications/Google\ Chrome.app/ --args --disable-web-security
```
or under Windows:
```
chrome.exe --disable-web-security
```

Of course Demoit works just fine if you open `index.html` via `http` protocol but to do that you need a server.
