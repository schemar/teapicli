import fs from "fs";
import Collection from "../Collection";
import Environment from "../Environment";
import Request from "../Request";
import Exporter from "../Exporter";

// File uses non-static methods to implement an interface:
/* eslint-disable class-methods-use-this */

export default class TeapicliExporter implements Exporter {
  public export(collection: Collection): void {
    const data = {
      name: collection.name,
      environments: {} as any,
      requests: {} as any,
    };

    collection.environments.forEach((environment: Environment) => {
      data.environments[environment.name] = environment.variables;
    });

    collection.requests.forEach((request: Request) => {
      data.requests[request.name] = {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
      };
    });

    return fs.writeFileSync(
      collection.path,
      `${JSON.stringify(data, null, 2)}\n`
    );
  }
}
