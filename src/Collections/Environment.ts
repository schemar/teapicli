export default class Environment {
  public readonly name: string;

  constructor({ name }: { name: string }) {
    this.name = name;
  }
}
