#!/usr/bin/env node

import React from "react";
import { render } from "ink";
import { Command } from "commander";
import Configuration from "./Configuration";
import UserInterface from "./UserInterface";

const program = new Command();

program
  .version("0.1.0")
  .option(
    "-g, --config <file>",
    "alternative configuration file to use",
    "~/.config/teapicli/config.json"
  )
  .option(
    "-c, --collection <file>",
    "a collection to load at start",
    "~/.config/teapicli/collections/default.json"
  )
  .option("-t, --client <type>", "the client to use for HTTP requests", "axios")
  .option(
    "-i, --importer <type>",
    "the importer to read the collection format",
    "teapicli"
  );

program.parse(process.argv);

const configuration: Configuration = new Configuration({
  configFile: program.config,
});

render(
  React.createElement(UserInterface, { program, configuration })
).waitUntilExit();
