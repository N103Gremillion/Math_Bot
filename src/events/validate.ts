import { ChatInputCommandInteraction, Channel } from "discord.js";
import { COMMAND_TYPE } from "../commands/command_types";
import { is_ping, execute_ping } from "../commands/ping";
import { is_ls, execute_ls } from "../commands/ls";

// function that checks if the current message is a valid command
export async function check_command( cmd : ChatInputCommandInteraction) : Promise<void> {
  if (!cmd.channel) {
    console.log("invalid channel");
  }
  const cmd_contents : string = cmd.commandName;
  const cmd_sender : string = cmd.user.username;

  console.log(`${cmd_sender}, sent : ${cmd_contents}`);

  const command_type : COMMAND_TYPE = get_command_type(cmd_contents);

  if (command_type == COMMAND_TYPE.PING) {
    await cmd.deferReply();
    await execute_ping(cmd);
  } else if (command_type == COMMAND_TYPE.LS) {
    await cmd.deferReply();
    await execute_ls(cmd);
  }

}

function get_command_type(msg_contents : string) {
  // check for all the types of commands
  if (is_ping(msg_contents)) {
    return COMMAND_TYPE.PING;
  } else if (is_ls(msg_contents)) {
    return COMMAND_TYPE.LS;
  }

  console.log("Invalid bot command! use :ls to view commands.");
  return COMMAND_TYPE.INVALID;
}
