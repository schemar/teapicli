import Environment from './Environment';
import Endpoint from './Endpoint';

export default class Collection {
  public readonly name: string;

  public readonly environments: Environment[];

  public readonly endpoints: Endpoint[];

  public constructor(
    collection: {
      name: string;
      environments: Environment[];
      endpoints: Endpoint[];
    },
  ) {
    this.name = collection.name;
    this.environments = collection.environments;
    this.endpoints = collection.endpoints;
  }
}
