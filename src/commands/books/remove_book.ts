import { ChatInputCommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { Command, COMMAND_TYPE } from "../command_types";
import { select_book_menu } from "../selection_menus";
import { wrap_str_in_code_block } from "../../utils/util";
import { remove_book_from_database } from "../../tables/books";

export async function execute_remove_book(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_menu(cmd);
}

export async function finish_executing_remove_book(interaction : StringSelectMenuInteraction, bookID : number) : Promise<void> {
  // try to remove the book 
  const successful_removal : boolean = await remove_book_from_database(bookID);

  if (successful_removal) {
    interaction.reply(
      wrap_str_in_code_block(
        `Book successfully removed from database.`
      )
    );
  } else {
    interaction.reply(
      wrap_str_in_code_block(
        `Issue trying to remove book from database.`
      )
    )
  }

}

export const remove_book_command : Command = {
  command : "remove_book",
  command_type : COMMAND_TYPE.REMOVE_BOOK,
  description : "remove a book from the database",
  action : execute_remove_book,
  requires_params : false
}