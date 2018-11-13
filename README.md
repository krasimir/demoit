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

## Usage

* Online at [krasimir.github.io/demoit/dist/](https://krasimir.github.io/demoit/dist/)
* Offline by downloading [Demoit.zip](https://github.com/krasimir/demoit/raw/master/demoit.zip). Unzip. There's a `index.html` which you can load in a browser.

## Configuration and content

The configuration for the tool is set in `settings.json` file:

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

By default Demoit first tries to read its settings and content from the `localStorage`. Then it falls back to the `settings.json`. If that's also missing it uses default values.

## Continuing your work offline

You may need to transfer your progress on your machine. In order to do that download [Demoit.zip](https://github.com/krasimir/demoit/raw/master/demoit.zip) and go to the storage manager. There is a button to it in the top right corner of the app. Then copy the content of the `settings.json` to your local folder.

## Resetting your progress to `settings.json`

Go to the storage manager. There is a link to it in the top right corner of the app. Then click on `Reset to the data in settings.json` button.

## Keyboard shortcuts

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
