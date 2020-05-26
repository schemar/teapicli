import { action, computed, observable } from "mobx";

export interface Message {
  type: "debug" | "info" | "warning" | "error";
  message: string;
}

export default class MessagesStore {
  @observable messages: Message[] = [];

  @action
  debug(message: string): void {
    this.messages.push({ type: "debug", message });
  }

  @action
  info(message: string): void {
    this.messages.push({ type: "info", message });
  }

  @action
  warning(message: string): void {
    this.messages.push({ type: "warning", message });
  }

  @action
  error(message: string): void {
    this.messages.push({ type: "error", message });
  }

  @computed
  get lastMessage(): Message | undefined {
    if (this.messages.length < 1) {
      return undefined;
    }
    return this.messages[this.messages.length - 1];
  }
}
