import { action, computed, observable } from "mobx";

export enum View {
  EnvironmentSelector,
  Main,
  Messages,
  RequestSelector,
}

export default class ViewsStore {
  @observable viewStack: View[] = [View.Main];

  @action
  pushView(view: View): void {
    // Remove previous existances. Every view must only be on the stack once.
    this.viewStack = this.viewStack.filter(
      (viewOnStack) => viewOnStack !== view
    );
    this.viewStack.push(view);
  }

  @action
  popView(): void {
    this.viewStack.pop();
  }

  @computed
  get activeView(): View | undefined {
    if (this.viewStack.length > 0) {
      return this.viewStack[this.viewStack.length - 1];
    }
    return undefined;
  }
}
