![demoit](./demoit.png)

# **Demoit** is a tiny JavaScript playground

* No installation.
* No server needed. It works offline.
* No building process needed. Built-in Babel support. It translates your code at runtime.
* Supports external libraries and styles. Like React for example.
* Persistent via localStorage (for now)
* Easy export of the current code

## Demo :rocket:

[https://krasimir.github.io/demoit/dist](https://krasimir.github.io/demoit/dist)

---

## Installation

Download [Demoit.zip](https://github.com/krasimir/demoit/raw/master/demoit.zip). Unzip. There's a `index.html` which you can load in a browser.

## Configuration

The configuration for the tool is set in `settings.json` file. Here is an example:

```json
{
  "editor": {
    "theme": "material"
  },
  "dependencies": [
    "./resources/react-16.7.0-alpha.0.js",
    "./resources/react-dom.16.7.0-alpha.0.js",
    "./resources/styles.css"
  ],
  "files": [
    {
      "filename": "script.js",
      "content": "const message = 'Hello world';\nconsole.log(message);"
    }
  ]
}
```

* `editor`
  * `theme` - Demoit uses CodeMirror as an editor so here you can place some of its build-in themes. Check them out [here](https://codemirror.net/demo/theme.html).
* `dependencies` - an array of files that your demo needs. This could be JavaScript or CSS files. They may be local or not. Demoit will fetch those resources before running your code files.
* `files` - It contains an array of items representing your scripts.

## Key combinations

There are only two key combination - `Ctrl + S` and `Cmd + S` which is basically triggering a new run of your current file.

## Editing filenames and deleting files

Right mouse click on the file's tab.

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
