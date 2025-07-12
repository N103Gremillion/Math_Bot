import { ChatInputCommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { Command, COMMAND_TYPE, COMMAND_TYPE_STRING } from "../command_types";
import { select_book_menu, select_bookshelf_menu } from "../selection_menus";
import { get_user_id_from_interaction, wrap_str_in_code_block } from "../../utils/util";
import { remove_book_from_bookshelf } from "../../tables/bookshelf";

export async function execute_remove_from_bookshelf(cmd : ChatInputCommandInteraction) : Promise<void> {
  select_bookshelf_menu(cmd);
}

export async function finish_executing_remove_from_bookshelf(
  interaction : StringSelectMenuInteraction, 
  book_isbn : string
) : Promise<void> {
  const user_id : number = await get_user_id_from_interaction(interaction);
  const successful_removal : boolean = await remove_book_from_bookshelf(book_isbn, user_id);

  if (successful_removal) {
    interaction.reply(
      wrap_str_in_code_block(
        `Book removed from bookshelf.
Book_isbn: ${book_isbn}.`
      )
    );
  } else {
    interaction.reply(
      wrap_str_in_code_block(
        `Issue removing from bookshelf.
Book_isbn: ${book_isbn}.`
      )
    );
  }

}

export const remove_from_bookshelf_command : Command = {
  command: COMMAND_TYPE_STRING.REMOVE_FROM_BOOKSHELF,
  command_type: COMMAND_TYPE.REMOVE_FROM_BOOKSHELF,
  description: "remove a book from your bookshelf",
  action: execute_remove_from_bookshelf,
  requires_params : false
}
