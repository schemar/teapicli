#!/usr/bin/env node

import { Command } from 'commander';
import Configuration from './Configuration';

import UserInterface from './UserInterface';
import Collections from './Collections';

const program = new Command();

program.version('0.1.0')
  .option(
    '-g, --config <file>',
    'alternative configuration file to use',
    '~/.config/apitecli/config.json',
  )
  .option(
    '-c, --collection <file>',
    'a collection to load at start',
    '~/.config/apitecli/collections/default.json',
  )
  .option(
    '-i, --importer <type>',
    'the importer to read the collection format',
    'apitecli',
  );

program.parse(process.argv);

const configuration: Configuration = new Configuration({
  configFile: program.config,
});

const terminal = new UserInterface(configuration);
terminal.start();

Collections.load({
  filePath: program.collection,
  importer: program.importer,
});
