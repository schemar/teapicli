import { action, computed, observable } from "mobx";
import Collection from "../Collections/Collection";
import Environment from "../Collections/Environment";
import Request from "../Collections/Request";
import Response from "../Response";

export default class CollectionStore {
  @observable collection: Collection | undefined;

  @observable selectedEnvironment: Environment | undefined;

  @observable selectedRequest: Request | undefined;

  @observable responses: Response[] = [];

  @action
  setCollection(collection: Collection | undefined): void {
    this.collection = collection;

    if (collection && collection.environments.length > 0) {
      [this.selectedEnvironment] = collection.environments;
    }

    if (collection && collection.requests.length > 0) {
      [this.selectedRequest] = collection.requests;
    }
  }

  @action
  setSelectedEnvironment(environment: Environment | undefined): void {
    this.selectedEnvironment = environment;
  }

  @action
  setSelectedEnvironmentByName(name: string): void {
    if (this.collection === undefined) {
      return;
    }
    this.collection.environments.forEach((environment) => {
      if (environment.name === name) {
        this.setSelectedEnvironment(environment);
      }
    });
  }

  @action
  setSelectedRequest(request: Request | undefined): void {
    this.selectedRequest = request;
  }

  @action
  setSelectedRequestByName(name: string): void {
    if (this.collection === undefined) {
      return;
    }
    this.collection.requests.forEach((request) => {
      if (request.name === name) {
        this.setSelectedRequest(request);
      }
    });
  }

  @action
  addResponse(response: Response | undefined): void {
    if (response !== undefined) {
      this.responses.push(response);
    }
  }

  @computed
  get lastResponse(): Response | undefined {
    if (this.responses.length > 0) {
      return this.responses[this.responses.length - 1];
    }
    return undefined;
  }

  @computed
  get hasEnvironments(): boolean {
    if (this.collection === undefined) {
      return false;
    }
    return this.collection.environments.length > 0;
  }

  @computed
  get hasRequests(): boolean {
    if (this.collection === undefined) {
      return false;
    }
    return this.collection.requests.length > 0;
  }
}
