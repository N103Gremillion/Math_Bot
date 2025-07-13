import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { get_user_id_from_interaction, reply} from "../../utils/util";
import { Command, COMMAND_TYPE, COMMAND_TYPE_STRING } from "../command_types";
import { BookshelfInfo, fetch_bookshelf_isbns } from "../../tables/bookshelf";
import { BookInfo, fetch_books_with_isbns } from "../../tables/books";
import { get_book_embeds } from "../embeds";

export async function execute_view_bookshelf(cmd : ChatInputCommandInteraction) : Promise<void> {
  const user_id : number = await get_user_id_from_interaction(cmd);
  const book_isbns : BookshelfInfo[] = await fetch_bookshelf_isbns(user_id);
  const books : BookInfo[] = await fetch_books_with_isbns(book_isbns);

  if (books.length === 0) {
    await reply (cmd, 
      `No books currently in bookshelf.`
    );
    return;
  }

  const embeds : EmbedBuilder[] = get_book_embeds(books);
  
  await cmd.reply({ embeds : embeds });
}


export const view_bookshelf_command : Command = {
  command: COMMAND_TYPE_STRING.VIEW_BOOKSHELF,
  command_type: COMMAND_TYPE.VIEW_BOOKSHELF,
  description: "View all books in your bookshelf",
  action: execute_view_bookshelf,
  requires_params : false
} 