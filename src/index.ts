import "./config/axios";
import { Command } from "commander";
import { sync_command } from "./commands";

async function start() {
  const program = new Command();

  for (const [flags, description] of sync_command.options) {
    program.option(flags, description);
  }

  program.action(sync_command.action);

  program.parse();
}

start();
