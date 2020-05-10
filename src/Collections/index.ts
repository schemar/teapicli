import { Events, Topic } from '../Events';
import Collection from './Collection';
import Environment from './Environment';
import Endpoint from './Endpoint';

export default class Collections {
  public static load(_: {filePath: string; importer: string}): Collection {
    const collection = new Collection({
      name: 'TestCollection',
      environments: [new Environment()],
      endpoints: [new Endpoint()],
    });

    Events.publish(Topic.NewCollection, { collection });

    return collection;
  }
}
