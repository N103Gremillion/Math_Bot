import { ChatInputCommandInteraction } from "discord.js";
import { wrap_str_in_code_block } from "../../utils/util";
import { Command, CommandType, CommandStringType } from "../command_types";
import { check_user_registered, fetch_user_id, insert_users_table, UserInfo } from "../../tables/users";
import { set_user_skillpoints_query } from "../../tables/user_skillpoints";

export async function execute_register_user (cmd : ChatInputCommandInteraction) : Promise<void> {
  await cmd.deferReply();

  const pending_response : string = `Trying to register user...\n`;
  await cmd.editReply(wrap_str_in_code_block(pending_response));

  const user_name : string  = cmd.user.username;

  // check if user is in the database already  
  const is_registered : boolean = await check_user_registered(user_name); 

  if (is_registered) {
    await cmd.editReply(
      wrap_str_in_code_block(
        `User ${user_name} has already been registered.`
      )
    );
    return;
  }

  // try and add the user to the users table
  const user_registered : boolean = await insert_users_table(user_name);
  let resulting_response : string = "";

  if (user_registered) {
    // set skillpoints to zero
    let user_id: number = await fetch_user_id(user_name);
    await set_user_skillpoints_query(user_id, 0);

    resulting_response = `Successfully registered user: ${user_name}\n`;
  } else {
    resulting_response = `Issue registering user user: ${user_name}\n`;
  }

  await cmd.editReply(wrap_str_in_code_block(resulting_response));
}

export const register_user_command: Command = {
    command_type: CommandType.REGISTER_USER,
    command: CommandStringType.REGISTER_USER,
    description: "Adds a user to the database",
    action: execute_register_user,
    requires_params : false
}