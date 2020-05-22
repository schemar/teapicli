import Environment from "./Environment";
import Request from "./Request";

export default class Collection {
  public readonly name: string;

  public readonly environments: Environment[];

  public readonly requests: Request[];

  /** The location on disk. */
  public readonly path: string;

  public constructor(collection: {
    name: string;
    environments: Environment[];
    requests: Request[];
    path: string;
  }) {
    this.name = collection.name;
    this.environments = collection.environments;
    this.requests = collection.requests;
    this.path = collection.path;
  }
}
