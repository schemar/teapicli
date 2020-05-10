import convict from 'convict';

export default class Configuration {
  private configuration: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(configFile: string) {
    this.configuration = convict({
      keys: {
        quit: {
          doc: 'key to quit the application',
          format: String,
          default: 'q',
        },
      },
    });

    this.configuration.loadFile(configFile);
    this.configuration.validate({ allowed: 'strict' });
  }

  public get(name: string): any { // eslint-disable-line @typescript-eslint/no-explicit-any
    return this.configuration.get(name);
  }
}
