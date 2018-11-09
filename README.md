![demoit](./demoit.png)

# **Demoit** is a small tool for live coding exercises <!-- omit in toc -->

* No installation.
* No server needed. Works offline.
* No building process.
* Build-in babel transpilation
* Supports external libs and styles. Like React for example.
* Supports multiple demos with multiple code snippets.

## Demo

Check the demo here [https://krasimir.github.io/demoit/dist](https://krasimir.github.io/demoit/dist) :rocket:

---

## Installation

Just clone/download this repository and use the content of the `dist` folder. There's a `index.html` which you can load in a browser.

## Configuration

The configuration for the tool is set in `dist/settings.json` file. Here is an example:

```json
{
  "editor": {
    "theme": "material"
  },
  "resources": [
    "./resources/react-16.7.0-alpha.0.js",
    "./resources/react-dom.16.7.0-alpha.0.js",
    "./resources/styles.css"
  ],
  "demos": [
    {
      "snippets": [
        "./demos/useHooks.js",
        "./demos/HoC.js",
        "./demos/FaCC.js"
      ]
    }
  ]
}
```

* `editor` - settings for the right side of the screen - the editor.
  * `theme` - Demoit uses CodeMirror as an editor so here you can place some of its build-in themes. Check them out [here](https://codemirror.net/demo/theme.html).
* `resources` - an array of files that your demo needs. This could be JavaScript or CSS files. They may be local or not. Demoit will fetch those first before running your demo files.
* `demos` - It contains an array of items representing your demos.

## Key combinations

There are only two key combination - `Ctrl + S` and `Cmd + S` which is basically triggering a new run of your function.

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
