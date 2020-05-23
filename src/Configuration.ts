import convict from "convict";

export default class Configuration {
  private configuration: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(options: { configFile: string }) {
    this.configuration = convict({
      importer: "teapicli",
      exporter: "teapicli",
      keys: {
        quit: {
          doc: "quit the application",
          format: String,
          default: "q",
        },
        close: {
          doc: "closes a viewport, like a pager",
          format: String,
          default: "q",
        },
        nextTabResponse: {
          doc: "selects the next tab for the request in main view",
          format: String,
          default: "h",
        },
        nextTabRequest: {
          doc: "selects the next tab for the response in main view",
          format: String,
          default: "g",
        },
        down: {
          doc: "scroll down, e.g. in a pager view",
          format: String,
          default: "j",
        },
        up: {
          doc: "scroll up, e.g. in a pager view",
          format: String,
          default: "k",
        },
        select: {
          doc: "select the item under cursor",
          format: String,
          default: "s",
        },
        send: {
          doc: "send the selected request",
          format: String,
          default: "s",
        },
        selectRequest: {
          doc: "select a different request to send",
          format: String,
          default: "r",
        },
        selectEnvironment: {
          doc: "focus environment to select with j/k",
          format: String,
          default: "v",
        },
        showResponse: {
          doc: "opens the pager and shows the entire response",
          format: String,
          default: "p",
        },
        edit: {
          doc:
            "opens an editor to edit the current collection (does not persist)",
          format: String,
          default: "e",
        },
        write: {
          doc: "persists the current state of the collection to disk",
          format: String,
          default: "w",
        },
      },
    });

    this.configuration.loadFile(options.configFile);
    this.configuration.validate({ allowed: "strict" });
  }

  public get(name: string): any {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    return this.configuration.get(name);
  }
}
