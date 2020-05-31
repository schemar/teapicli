#!/usr/bin/env node

// MobX Observer Batching: https://github.com/mobxjs/mobx-react-lite/#observer-batching
import "mobx-react-lite/batchingForReactDom";

import React from "react";
import { render } from "ink";
import { Command } from "commander";
import Configuration from "./Configuration";
import UserInterface from "./UserInterface";

const program = new Command();

program
  .name("teapicli")
  .version("1.0.0-alpha.1")
  .arguments("<collection>")
  .option("-g, --config <file>", "alternative configuration file to use")
  .option(
    "-t, --client <type>",
    "the client to use for HTTP requests",
    "axios"
  );

/* eslint-disable no-console */
// must be before .parse()
program.on("--help", () => {
  console.log("");
  console.log("Example call:");
  console.log("  $ teapicli ./my-collection.json");
});

program.parse(process.argv);

if (program.args.length !== 1) {
  program.help();
}

const [collectionPath] = program.args;

const configuration: Configuration = new Configuration({
  configFile: program.config,
});

render(
  React.createElement(UserInterface, { collectionPath, program, configuration })
).waitUntilExit();
