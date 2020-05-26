import { store } from "../Store";
import Client from "../Client";
import Request from "../Collections/Request";
import Environment from "../Collections/Environment";
import Response from "../Response";
import AxiosClient from "./AxiosClient";

export default class Clients {
  public static send(
    clientName: string,
    request: Request,
    environment?: Environment
  ): Promise<Response | undefined> {
    const client = Clients.getClient(clientName);
    if (client === undefined) {
      return Promise.resolve(undefined);
    }

    const replacedRequest =
      environment !== undefined
        ? Clients.applyEnvironment(environment, request)
        : request;

    return client.send(replacedRequest);
  }

  private static getClient(clientName: string): Client | undefined {
    switch (clientName) {
      case "axios":
        return new AxiosClient();
      default:
        store.messagesStore.error(
          `Unknown client, cannot continue: ${clientName}`
        );
    }

    return undefined;
  }

  private static applyEnvironment(
    environment: Environment,
    request: Request
  ): Request {
    return {
      ...request,
      url: Clients.replaceVariables(environment, request.url),
      body: Clients.replaceVariables(environment, request.body),
      headers: Clients.replacePropertiesVariables(environment, request.headers),
    };
  }

  private static replaceVariables(
    environment: Environment,
    input: string
  ): string {
    const regexp = /{{(.*?)}}/g;

    let match = regexp.exec(input);
    let newStr = input;
    while (match !== null) {
      newStr = Clients.replaceVariable(environment, newStr, match);
      match = regexp.exec(input);
    }

    return newStr;
  }

  private static replaceVariable(
    environment: Environment,
    input: string,
    match: string[]
  ): string {
    if (environment.variables[match[1]] !== undefined) {
      return input.replace(match[0], environment.variables[match[1]]);
    }

    const nestedEnv = this.findNestedEnv(environment, match);

    if (nestedEnv) {
      return input.replace(match[0], nestedEnv);
    }

    return input;
  }

  private static findNestedEnv(
    environment: Environment,
    match: string[]
  ): string | undefined {
    const split = match[1].split(".");
    let nestedEnv = environment.variables;
    // Iterate down the object properties and sub-properties
    for (let i = 0; i < split.length; i += 1) {
      if (nestedEnv[split[i]] !== undefined) {
        nestedEnv = nestedEnv[split[i]];
      } else {
        store.messagesStore.error(
          `Cannot find variable in environment: ${match[1]} (not replacing it)`
        );
        return undefined;
      }
    }
    return nestedEnv;
  }

  private static replacePropertiesVariables(
    environment: Environment,
    input: {
      [key: string]: string;
    }
  ): { [key: string]: string } {
    const replacedProperties: { [key: string]: string } = {};

    Object.keys(input).forEach((key: string) => {
      replacedProperties[key] = Clients.replaceVariables(
        environment,
        input[key]
      );
    });

    return replacedProperties;
  }
}
