import { action, observable } from "mobx";

export interface Commands {
  [key: string]: () => void;
}

export default class CommandsStore {
  @observable availableCommands: Commands = {};

  @action
  registerCommands(commands: Commands): void {
    this.availableCommands = {
      ...this.availableCommands,
      ...commands,
    };
  }

  @action
  unregisterCommands(commands: Commands): void {
    Object.keys(commands).forEach((commandKey) => {
      delete this.availableCommands[commandKey];
    });
  }
}
