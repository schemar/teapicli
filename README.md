# apitecli

**Pre-alpha; not really usable**

Apitecli is a terminal API client.
You can use it to make web requests and inspect responses.
It allows you to store and group requests for faster access.

## Installation

```sh
git clone
yarn
yarn start
```

## Usage

If you start apitecli with `yarn start`, it will use the examples provided with this repo.
You can check `./config.json` and, more importantly, `./collection.json`.
The collection file defines the requests you will be able to make from within apitecli.

Help output:

```sh
Usage: app [options]

Options:
  -V, --version            output the version number
  -g, --config <file>      alternative configuration file to use (default: "~/.config/apitecli/config.json")
  -c, --collection <file>  a collection to load at start (default: "~/.config/apitecli/collections/default.json")
  -t, --client <type>      the client to use for HTTP requests (default: "axios")
  -i, --importer <type>    the importer to read the collection format (default: "apitecli")
  -h, --help               display help for command
```

### Keys

| View | Key | Name | Effect |
| ---- | --- | ---- | ------ |
| Main view | `s` | `send` | Send the currently selected request |
| Main view | `h` | `nextTab` | Switch tabs (body, headers) to inspect reqeust/response |
| Main view | `p` | `showResponse` | Display the entire response body in a scrollable pager |
| Main view | `q` | `quit` | Quit the application |
| Pager | `j` | `down` | Scroll down one line |
| Pager | `k` | `up` | Scroll up one line |
| Pager | `q` | `close` | Close the pager and return to the main view |

## Pre-Alpha

* It is not yet possible to change the selected environment or request.
  * It always loads the first request from the collection. Update the collection to try a different request.
* Variables from the environment are not yet evaluated.

### Example Usage

* `yarn start`
* `s` to make a request
* `h` to check response headers
* `p` to see the entire response in the pager
* `j/k` scroll in the pager
* `q` close the pager
* `s` make the same request again
* `q` quit the application
