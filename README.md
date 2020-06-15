# teapicli

Teapicli is a terminal API client.
You can use it to make web requests and inspect responses.
It allows you to store and group requests for faster access.

## Installation

Install as a global npm package:

```sh
npm install -g teapicli
```

Teapicli is changing rapidly at the moment.
In order to get the latest version from `master`:

```sh
git clone git@github.com:schemar/teapicli.git
cd teapicli
yarn
yarn build

# Run with node:
node ./dist/cli.js

# Alternatively, link from $PATH, e.g.:
chmod u+x ./dist/cli.js
ln -s $(pwd)/dist/cli.js /usr/local/bin/teapicli
```

## Usage

Basic usage:

```sh
teapicli ./my-collection.json
```

You can check [`./examples/collection.json`](./examples/collection.json).
The collection file defines the requests you will be able to make from within teapicli.

Help output:

```sh
Usage: teapicli [options] <collection>

Options:
  -V, --version        output the version number
  -g, --config <file>  alternative configuration file to use
  -t, --client <type>  the client to use for HTTP requests (default: "axios")
  -h, --help           display help for command

Example call:
  $ teapicli ./my-collection.json
```

### Views

| View | Explanation |
| ---- | ----------- |
| Main view | The app opens in the main view. Here you see the collection and can send requests. |
| Selector | In the selector you can select an item. For example, when you want to change the selected request of the collection, the selector will open with a list of all requests to select one from. |
| Messages | Lists all messages (including errors and warnings) that teapicli put out. |

### Commands

| View | Key | Command | Effect |
| ---- | --- | ------- | ------ |
| All views | `:` | `command` | Type out a command by its name (names from this table). |
| All views | `q` | `close` | Close the current view and return to the previous view on the stack. When the last view is closed, the application exits. |
| All views | `?` | `close` | Display all commands that are available in the current view (in `$PAGER`). |
| All views | `m` | `listMessages` | Open the messages view that lists previous messages. |
| Main view | `s` | `send` | Send the currently selected request. |
| Main view | `g` | `nextTabRequest` | Switch tabs (body, headers) to inspect request. |
| Main view | `h` | `nextTabResponse` | Switch tabs (body, headers) to inspect response. |
| Main view | `p` | `showResponse` | Display the body of the last response in `$PAGER`. |
| Main view | `r` | `selectRequst` | Open the selector to select another request of the collection. |
| Main view | `v` | `selectEnvironment` | Open the selector to select another environment of the collection. |
| Main view | `e` | `edit` | Edit the collection in your `$EDITOR`. Make sure to persist with `w` if you want to keep the changes. |
| Main view | `w` | `write` | Persist the current state of the collection to disk. |
| Selector  | `j` | `down` | Move pointer one line down. |
| Selector  | `k` | `up` | Move pointer one line up. |
| Selector  | `s` | `select` | Select item under the current pointer, e.g. the request, and close the selector. |

### Configuration

Teapicli uses [convict](https://github.com/mozilla/node-convict) to manage configuration.

You can create a configuration file at `$HOME/.config/teapicli/config.json`.
If you do, it will be read on every start of teapicli.
You can still override it with the `--config` CLI option.

The configuration is a JSON file that can change the default configuration.
Check [`Configuration.ts`](./src/Configuration.ts) for the available options.
For example, to map the `quit` command to `a` instead of `q`, it would look like the following:

```json
{
  "keys": {
    "quit": "a"
  }
}
```

