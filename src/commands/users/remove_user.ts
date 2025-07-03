import { ChatInputCommandInteraction } from "discord.js";
import { wrap_str_in_code_block } from "../../utils/util";
import { Command, COMMAND_TYPE } from "../command_types";
import { check_user_registered, insert_users_table, remove_from_users_table } from "../../tables/users";

export async function execute_remove_user(cmd : ChatInputCommandInteraction) : Promise<void> {
  await cmd.deferReply();

  const pending_response : string = `Trying to remove user...\n`;
  await cmd.editReply(wrap_str_in_code_block(pending_response));

  await new Promise(resolve => setTimeout(resolve, 500));

  const user_name : string  = cmd.user.username;

  // check if user in database
  const is_registered : boolean = await check_user_registered(user_name);

  if (!is_registered) {
    cmd.editReply(
      wrap_str_in_code_block(
        `User doesn't exists in database.`
      )
    );
    return;
  }

  // try and add the user to the users table
  const user_removed : boolean = await remove_from_users_table(user_name); 
  let resulting_response : string = "";

  if (user_removed) {
    resulting_response = `Successfully removed user. \n`;
  } else {
    resulting_response = `Issue registering user. \n`;
  }

  await cmd.editReply(wrap_str_in_code_block(resulting_response));
}

export const remove_user_command: Command = {
  command_type: COMMAND_TYPE.REMOVE_USER,
  command: "remove_user",
  description: "Removes a user to the database",
  action: execute_remove_user,
  requires_params : false
}