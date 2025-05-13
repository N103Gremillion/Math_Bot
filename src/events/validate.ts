import { Message } from "discord.js";
import { COMMAND_TYPE } from "../commands/command_types";
import { is_ping, execute_ping } from "../commands/ping";
import { is_ls, execute_ls } from "../commands/ls";

// prefix that denotes a command
const PREFIX = ",";

// function that checks if the current message is a valid command
export function check_message( msg : Message ) : void {
  const msg_contents : string = msg.content.toString();
  const msg_sender : string = msg.author.username; 
  console.log(`${msg_sender}, sent : ${msg_contents}`);

  const command_type : COMMAND_TYPE = get_command_type(msg_contents);

  if (command_type == COMMAND_TYPE.PING) {
    execute_ping(msg);
  } else if (command_type == COMMAND_TYPE.LS) {
    execute_ls(msg);
  }
}

function get_command_type(msg_contents : string) {
  
  const str_len : number = msg_contents.length;

  // shortest command is 3 (:ls)
  if (str_len < 3 || msg_contents.charAt(0) != PREFIX) {
    return COMMAND_TYPE.INVALID;
  }

  const command_without_prefix : string = msg_contents.substring(1);
  
  // check for all the types of commands
  if (is_ping(command_without_prefix)) {
    return COMMAND_TYPE.PING;
  } else if (is_ls(command_without_prefix)) {
    return COMMAND_TYPE.LS;
  }

  console.log("Invalid bot command! use :ls to view commands.");
  return COMMAND_TYPE.INVALID;

}
