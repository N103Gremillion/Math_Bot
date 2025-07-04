import { ChatInputCommandInteraction } from "discord.js";
import { wrap_str_in_code_block } from "../../utils/util";
import { Command, COMMAND_TYPE } from "../command_types";
import { check_user_registered, insert_users_table } from "../../tables/users";

export async function execute_register_user (cmd : ChatInputCommandInteraction) : Promise<void> {
  await cmd.deferReply();

  const pending_response : string = `Trying to register user...\n`;
  await cmd.editReply(wrap_str_in_code_block(pending_response));

  await new Promise(resolve => setTimeout(resolve, 500));

  const user_name : string  = cmd.user.username;

  // check if user is in the database already  
  const is_registered : boolean = await check_user_registered(user_name); 

  if (is_registered) {
    await cmd.editReply(
      wrap_str_in_code_block(
        `User has already been registered.`
      )
    );
    return;
  }

  // try and add the user to the users table
  const user_registered : boolean = await insert_users_table(user_name);
  let resulting_response : string = "";

  if (user_registered) {
    resulting_response = `Successfully registered user \n`;
  } else {
    resulting_response = `Issue registering user \n`;
  }

  await cmd.editReply(wrap_str_in_code_block(resulting_response));
}

export const register_user_command: Command = {
    command_type: COMMAND_TYPE.REIGSTER_USER,
    command: "register_user",
    description: "Adds a user to the database",
    action: execute_register_user,
    requires_params : false
}