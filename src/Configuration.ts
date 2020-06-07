import fs from "fs";
import os from "os";
import path from "path";
import convict from "convict";

export default class Configuration {
  private configuration: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(options: { configFile: string }) {
    this.configuration = convict({
      importer: "teapicli",
      exporter: "teapicli",
      keys: {
        command: {
          doc: "Start entering a command by name.",
          format: String,
          default: ":",
        },
        close: {
          doc:
            "Close the current view and return to the previous view. Exits the application if the last view is closed.",
          format: String,
          default: "q",
        },
        listMessages: {
          doc: "Open a view with all recent messages.",
          format: String,
          default: "m",
        },
        nextTabResponse: {
          doc: "Selects the next tab for the request in main view.",
          format: String,
          default: "h",
        },
        nextTabRequest: {
          doc: "Selects the next tab for the response in main view.",
          format: String,
          default: "g",
        },
        down: {
          doc: "Scroll down, e.g. in a pager view.",
          format: String,
          default: "j",
        },
        up: {
          doc: "Scroll up, e.g. in a pager view.",
          format: String,
          default: "k",
        },
        select: {
          doc: "Select the item under cursor.",
          format: String,
          default: "s",
        },
        send: {
          doc: "Send the selected request.",
          format: String,
          default: "s",
        },
        selectRequest: {
          doc: "Select a different request to send.",
          format: String,
          default: "r",
        },
        selectEnvironment: {
          doc: "Focus environment to select with j/k.",
          format: String,
          default: "v",
        },
        showResponse: {
          doc: "Opens the pager and shows the entire response.",
          format: String,
          default: "p",
        },
        edit: {
          doc:
            "Opens an editor to edit the current collection (does not persist).",
          format: String,
          default: "e",
        },
        write: {
          doc: "Persists the current state of the collection to disk.",
          format: String,
          default: "w",
        },
      },
    });

    // Read the config from the given path.
    // If no path is given, check in the default path.
    // If the file doesn't exist, don't read it.
    const configPath =
      options.configFile ??
      path.join(os.homedir(), ".config", "teapicli", "config.json");
    if (fs.existsSync(configPath)) {
      this.configuration.loadFile(configPath);
    }

    this.configuration.validate({ allowed: "strict" });
  }

  public get(name: string): any {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    return this.configuration.get(name);
  }
}
