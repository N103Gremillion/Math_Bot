import { ChatInputCommandInteraction } from "discord.js";
import { Command, COMMAND_TYPE, COMMAND_TYPE_STRING } from "../command_types";
import { select_book_menu } from "../selection_menus";

export async function execute_add_to_bookshelf(cmd : ChatInputCommandInteraction) : Promise<void> {
  select_book_menu(cmd);
}

export async function finish_executing_add_to_bookshelf() : Promise<void> {

}

export const add_to_bookshelf_command : Command = {
  command: COMMAND_TYPE_STRING.ADD_TO_BOOKSHELF,
  command_type: COMMAND_TYPE.ADD_TO_BOOKSHELF,
  description: "View all the registered books",
  action: execute_add_to_bookshelf,
  requires_params : false
}