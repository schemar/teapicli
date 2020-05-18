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

### Views

| View | Explanation |
| ---- | ----------- |
| Main view | The app opens in the main view. Here you see the collection and can send requests. |
| Pager | The pager shows content in a scrollable buffer. Could, for example, show a long response body. |
| Selector | In the selector you can select an item. For example, when you want to change the selected request of the collection, the selector will open with a list of all requests to select one from. |

### Keys

| View | Key | Name | Effect |
| ---- | --- | ---- | ------ |
| Main view | `s` | `send` | Send the currently selected request |
| Main view | `h` | `nextTab` | Switch tabs (body, headers) to inspect reqeust/response |
| Main view | `p` | `showResponse` | Display the entire response body in a scrollable pager |
| Main view | `r` | `selectRequst` | Open the selector to select another request of the collection |
| Main view | `q` | `quit` | Quit the application |
| Pager | `j` | `down` | Scroll down one line |
| Pager | `k` | `up` | Scroll up one line |
| Pager | `q` | `close` | Close the pager and return to the main view |
| Selector | `j` | `down` | Move pointer one line down |
| Selector | `k` | `up` | Move pointer one line up |
| Selector | `s` | `select` | Select item under the current pointer, e.g. the request, and close the selector |
| Selector | `q` | `close` | Close the selector and return to the main view withou change |

## Pre-Alpha

* It is not yet possible to change the selected environment.
* Variables from the environment are not yet evaluated.

### Example Usage

* `yarn start`
* `s` to make a request
* `h` to check response headers
* `p` to see the entire response in the pager
* `j/k` scroll in the pager
* `q` close the pager
* `r` choose another request
* `s` confirm selection
* `s` make the newly selected request
* `q` quit the application
