import Environment from "./Environment";
import Request from "./Request";

export default class Collection {
  public readonly name: string;

  public readonly environments: Environment[];

  public readonly requests: Request[];

  public constructor(collection: {
    name: string;
    environments: Environment[];
    requests: Request[];
  }) {
    this.name = collection.name;
    this.environments = collection.environments;
    this.requests = collection.requests;
  }
}
