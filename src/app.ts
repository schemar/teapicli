#!/usr/bin/env node

import { Command } from 'commander';
import UserInterface from './UserInterface';

const program = new Command();

program.version('0.1.0');

program.parse(process.argv);

const terminal = new UserInterface();
terminal.start();
