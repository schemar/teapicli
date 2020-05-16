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
        send: {
          doc: "send the selected request",
          format: String,
          default: "s",
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
