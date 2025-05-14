import { ChatInputCommandInteraction } from "discord.js";
import { COMMAND_TYPE } from "./command_types";
import { commands_g } from "../entry";

export async function execute_command(cmd : ChatInputCommandInteraction) : Promise<void> {
  if (!cmd.channel) {
    console.log("invalid channel");
    return;
  }

  const cmd_contents = cmd.commandName;
  let command_type = COMMAND_TYPE.INVALID;

  for (const command of commands_g) {
    if (cmd_contents === command.command) {
      command_type = command.command_type;
      console.log(`executing command ${command.command}`);
      await command.action(cmd);
      break;
    }
  }

  if(command_type == COMMAND_TYPE.INVALID) {
      console.log("invalid bot command! use ,ls to view commands.");
      return;
  }
}