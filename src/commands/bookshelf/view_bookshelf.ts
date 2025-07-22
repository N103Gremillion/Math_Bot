import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { get_user_id_from_interaction, wrap_str_in_code_block } from "../../utils/util";
import { Command, CommandType, CommandStringType } from "../command_types";
import { BookshelfInfo, fetch_bookshelf_state } from "../../tables/bookshelf";
import { get_book_embeds } from "../embeds";

export async function execute_view_bookshelf(cmd : ChatInputCommandInteraction) : Promise<void> {
  const user_id : number = await get_user_id_from_interaction(cmd);
  const bookshelf_state : BookshelfInfo[] = await fetch_bookshelf_state(user_id);

  if (bookshelf_state.length === 0) {
    await cmd.reply (
      wrap_str_in_code_block( 
      `No books currently in bookshelf.`
      )
    );
    return;
  }

  const embeds : EmbedBuilder[] = await get_book_embeds(bookshelf_state);
  
  await cmd.reply({ embeds : embeds });
}


export const view_bookshelf_command : Command = {
  command: CommandStringType.VIEW_BOOKSHELF,
  command_type: CommandType.VIEW_BOOKSHELF,
  description: "View all books in your bookshelf",
  action: execute_view_bookshelf,
  requires_params : false
} 