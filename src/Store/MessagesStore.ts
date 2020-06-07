import { action, computed, observable } from "mobx";

export interface Message {
  type: "debug" | "info" | "warning" | "error";
  message: string;
  dateTime: Date;
}

export default class MessagesStore {
  @observable messages: Message[] = [];

  @action
  push(message: { type: Message["type"]; message: Message["message"] }): void {
    this.messages.push({
      ...message,
      dateTime: new Date(),
    });
  }

  @action
  debug(message: string): void {
    this.push({ type: "debug", message });
  }

  @action
  info(message: string): void {
    this.push({ type: "info", message });
  }

  @action
  warning(message: string): void {
    this.push({ type: "warning", message });
  }

  @action
  error(message: string): void {
    this.push({ type: "error", message });
  }

  @computed
  get lastMessage(): Message | undefined {
    if (this.messages.length < 1) {
      return undefined;
    }
    return this.messages[this.messages.length - 1];
  }
}
