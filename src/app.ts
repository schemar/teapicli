#!/usr/bin/env node

import { Command } from 'commander';
import Configuration from './Configuration';
import UserInterface from './UserInterface';

const program = new Command();

program.version('0.1.0')
  .option(
    '-c, --config <file>',
    'alternative configuration file to use',
    '~/.config/apitecli/config.json',
  );

program.parse(process.argv);

const configuration: Configuration = new Configuration(program.config);

const terminal = new UserInterface(configuration);
terminal.start();
