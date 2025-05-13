import { Message } from "discord.js";
import { COMMAND_TYPE } from "./command_types";

// prefix that denotes a command
const PREFIX = ":";

// function that checks if the current message is a valid command
export function check_message( msg : Message ) : void {
  const msg_contents : string = msg.content.toString();
  const msg_sender : string = msg.author.username; 
  console.log(`${msg_sender}, sent : ${msg_contents}`);

  const command_type : COMMAND_TYPE = get_command_type(msg_contents);
}

function get_command_type(msg_contents : string) {
  
  const str_len : number = msg_contents.length;

  // shortest command is 3 (:ls)
  if (str_len < 3 || msg_contents.charAt(0) != PREFIX) {
    return COMMAND_TYPE.INVALID;
  }

  const command_without_prefix : string = msg_contents.substring(1);
  
  // check for all the types of commands

  return COMMAND_TYPE.INVALID;

}
