![demoit](./demoit.png)

# **Demoit** is a small tool for live coding exercises <!-- omit in toc -->

* Dependency free.
* No installation. Just copy/paste and open in a browser.
* No server needed.
* Uses Babel 6.26.0 to transpile your code.
* Supports React
* Supports multiple demos with multiple code snippets.

---

## Installation

Just clone/download this repository and open `index.html` in a browser.

## Configuration

The tool requires a `settings.json` file in the same directory as the `index.html` file. Here is an example:

```json
{
  "editor": {
    "theme": "material",
    "nice themes": "dark: material, light: neat",
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
      "frames": [
        "./demos/01/useHooks.js",
        "./demos/01/HoC.js",
        "./demos/01/FaCC.js"
      ],
      "transform": "babelToReact"
    }
  ]
}
```

## Troubleshooting

### Error `URL scheme must be "http" or "https" for CORS request.`

It means that the browser doesn't load the files that the tools need because the protocol is `file://`. That's a problem in Chrome at the moment. Everything works fine in Firefox. To fix the problem in Chrome you have to run it like so:

```
open /Applications/Google\ Chrome.app/ --args --disable-web-security
```
or under Windows:
```
chrome.exe --disable-web-security
```

Of course the Demoit works just fine if you open `index.html` via `http` protocol but for that you need some sort of server.





To pick a theme check out https://codemirror.net/demo/theme.html
