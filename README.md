![demoit](./demoit.png)

# **Demoit** is a interactive JavaScript playground

* No installation.
* No server needed. It works offline.
* No building process needed. Built-in Babel support. It translates your code at runtime.
* Supports external libraries and styles. Like React for example.
* Persistent via localStorage
* Easy export of the current code
* Supports `import` statement (between the files of app)
* Supports `import`ing of CSS and HTML files

## Demo :rocket:

* React - [https://krasimir.github.io/demoit/dist](https://krasimir.github.io/demoit/dist?state=../samples/React.json)
* Vue - [https://krasimir.github.io/demoit/dist](https://krasimir.github.io/demoit/dist?state=../samples/Vue.json)
* HTML+CSS - [https://krasimir.github.io/demoit/dist](https://krasimir.github.io/demoit/dist?state=../samples/HTML+CSS.json)

---

## Usage

* Online at [krasimir.github.io/demoit/dist/](https://krasimir.github.io/demoit/dist)
* Offline by downloading [Demoit.zip](https://github.com/krasimir/demoit/raw/master/demoit.zip)

## Configuration

When you open the app and start writing code you progress gets saved to the local storage. You can grab it by opening the bar at the top and clicking on the gear icon (check section "Local storage"). The JSON there contains all the configuration that Demoit needs. You can save this configuration to an external file and let Demoit knows the path to it via the `state` GET parameter (for example `http://localhost/demoit?state=./mycode.json`).

Here is what the configuration may contain:

```json
{
  "editor": {
    "theme": "material",
    "layout": {
      "direction": "vertical",
      "sizes": [
        30,
        70
      ],
      "elements": [
        {
          "direction": "horizontal",
          "sizes": [
            50,
            50
          ],
          "elements": [
            "output",
            "log"
          ]
        },
        "editor"
      ]
    }
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
  * `layout` - this field defines how the app looks like. Which of the sections are displayed and what's their size.
* `dependencies` - an array of files that your demo needs. This could be JavaScript or CSS files. They may be local or not. Demoit will fetch those resources before running your code files.
* `files` - It contains an array of items representing your scripts.

## GET Params

* `?state=` - relative path to a JSON file

## Continuing your work offline

* You have to download [Demoit.zip](https://github.com/krasimir/demoit/raw/master/demoit.zip)
* You need to transfer your progress to a JSON file and pass it to the app via `state` GET param
* If you use external dependencies make sure that they are also saved locally and the path to the files is properly set (check the gear icon in the lower right corner of the screen)

## Keyboard shortcuts

* `Ctrl + S` and `Cmd + S` which is basically triggering a new run of your current file.

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
