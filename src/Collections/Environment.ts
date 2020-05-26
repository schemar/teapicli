export default class Environment {
  public readonly name: string;

  public readonly variables: any;

  constructor({ name, variables }: { name: string; variables: any }) {
    this.name = name;
    this.variables = variables;
  }
}
