import fs from "fs";
import Collection from "../Collection";
import Environment from "../Environment";
import Request from "../Request";
import Importer from "../Importer";

// File uses non-static methods to implement an interface:
/* eslint-disable class-methods-use-this */

export default class TeapicliImporter implements Importer {
  public import(filePath: string): Collection {
    const inputFile = fs.readFileSync(filePath, { encoding: "utf8" });
    const input = JSON.parse(inputFile);

    const collection = new Collection({
      name: input.name,
      environments: this.environments(input),
      requests: this.requests(input),
      path: filePath,
    });

    return collection;
  }

  private environments(input: any): Environment[] {
    const environments: Environment[] = [];

    Object.keys(input.environments).forEach((name: string) => {
      environments.push(
        new Environment({ name, variables: input.environments[name] })
      );
    });

    return environments;
  }

  private requests(input: any): Request[] {
    const requests: Request[] = [];

    Object.keys(input.requests).forEach((name: string) => {
      const request: any = input.requests[name];
      requests.push(
        new Request({
          name,
          ...request,
        })
      );
    });

    return requests;
  }
}
