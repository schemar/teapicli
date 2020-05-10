import PubSub from 'pubsub-js';
import Collection from '../Collections/Collection';

export type Token = string;

export enum Topic {
  NewCollection = 'NEW_COLLECTION',
  Error = 'ERROR',
}

export class Events {
  public static subscribe(
    topic: Topic,
    subscriber: (data: any) => void,
  ): Token {
    return PubSub.subscribe(
      topic,
      (_: Topic, received: any) => { subscriber(received); },
    );
  }

  public static unsubscribe(token: Token): void {
    PubSub.unsubscribe(token);
  }

  public static publish(topic: Topic, data: any): void {
    PubSub.publish(topic, data);
  }
}
