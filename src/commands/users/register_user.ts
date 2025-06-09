import { ChatInputCommandInteraction } from "discord.js";
import { send_message } from "../../events/message";
import { wrap_str_in_code_block } from "../../util";
import { Command, COMMAND_TYPE } from "../command_types";

export async function execute_register_user (cmd : ChatInputCommandInteraction) : Promise<void> {
  const response_string = `Trying to register user...\n`;
  const block_string = wrap_str_in_code_block(response_string);
  await send_message(cmd, block_string);

  // try and add the user to the users table

}

export const register_user_command: Command = {
    command_type: COMMAND_TYPE.REIGSTER_USER,
    command: "register_user",
    description: "Adds a user to the database",
    action: execute_register_user
}