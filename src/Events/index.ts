import PubSub from 'pubsub-js';

export type Token = string;

export enum Topic {
  Error = 'ERROR',
}

export type Data<T extends Topic> =
  T extends Topic.Error? { message: string }
  : { message: string };

export class Events {
  public static subscribe(
    topic: Topic,
    subscriber: (subTopic: typeof topic, data: Data<typeof topic>) => void,
  ): Token {
    return PubSub.subscribe(topic, subscriber);
  }

  public static unsubscribe(token: Token): void {
    PubSub.unsubscribe(token);
  }

  public static publish(topic: Topic, data: Data<typeof topic>): void {
    PubSub.publish(topic, data);
  }
}
