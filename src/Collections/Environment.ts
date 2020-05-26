import Request from "./Request";
import { store } from "../Store";

export default class Environment {
  public readonly name: string;

  public readonly variables: any;

  constructor({ name, variables }: { name: string; variables: any }) {
    this.name = name;
    this.variables = variables;
  }

  public applyTo(request: Request): Request {
    return {
      ...request,
      url: this.replaceVariables(request.url),
      body: this.replaceVariables(request.body),
      headers: this.replacePropertiesVariables(request.headers),
    };
  }

  private replaceVariables(input: string): string {
    const regexp = /{{(.*?)}}/g;

    let match = regexp.exec(input);
    let newStr = input;
    while (match !== null) {
      newStr = this.replaceVariable(newStr, match);
      match = regexp.exec(input);
    }

    return newStr;
  }

  private replaceVariable(input: string, match: string[]): string {
    if (this.variables[match[1]] !== undefined) {
      return input.replace(match[0], this.variables[match[1]]);
    }

    const nestedEnv = this.findNestedEnv(match);

    if (nestedEnv) {
      return input.replace(match[0], nestedEnv);
    }

    return input;
  }

  private findNestedEnv(match: string[]): string | undefined {
    const split = match[1].split(".");
    let nestedEnv = this.variables;
    // Iterate down the object properties and sub-properties
    for (let i = 0; i < split.length; i += 1) {
      if (nestedEnv[split[i]] !== undefined) {
        nestedEnv = nestedEnv[split[i]];
      } else {
        store.messagesStore.error(`Unknown variable in string: ${match[1]}`);
        return undefined;
      }
    }
    return nestedEnv;
  }

  private replacePropertiesVariables(input: {
    [key: string]: string;
  }): { [key: string]: string } {
    const replacedProperties: { [key: string]: string } = {};

    Object.keys(input).forEach((key: string) => {
      replacedProperties[key] = this.replaceVariables(input[key]);
    });

    return replacedProperties;
  }
}
