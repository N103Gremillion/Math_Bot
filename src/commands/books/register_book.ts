import { ChatInputCommandInteraction } from "discord.js";
import { COMMAND_TYPE, Command } from "../command_types";
import { wrap_str_in_code_block } from "../../utils/util";

export async function execute_register_book (cmd : ChatInputCommandInteraction) : Promise<void> {
  await cmd.deferReply();

  const pending_response : string = `Trying to register user...\n`;
  await cmd.editReply(wrap_str_in_code_block(pending_response));

  await new Promise(resolve => setTimeout(resolve, 500));

  // try and add the user to the users table
  // const user_registered : boolean = await insert_users_table(user_name);
  let resulting_response : string = "";

  // if (user_registered) {
  //   resulting_response = `Successfully registered user \n`;
  // } else {
  //   resulting_response = `Issue registering user \n`;
  // }

  await cmd.editReply(wrap_str_in_code_block(resulting_response));
} 

export const register_book_command : Command = {
  command_type: COMMAND_TYPE.REGISTER_BOOK,
  command: "register_book",
  description: "Adds a book to the database",
  action: execute_register_book,
  requires_params : true
}