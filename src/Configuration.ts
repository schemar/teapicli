import convict from "convict";

export default class Configuration {
  private configuration: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(options: { configFile: string }) {
    this.configuration = convict({
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
        send: {
          doc: "send the selected request",
          format: String,
          default: "s",
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
