import { action, computed, observable } from "mobx";

export enum View {
  Main,
  ResponsePager,
  RequestSelector,
  EnvironmentSelector,
}

export default class ViewsStore {
  @observable viewStack: View[] = [View.Main];

  @action
  pushView(view: View): void {
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
