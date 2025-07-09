import { BookInfo, fetch_book_info } from './../../tables/books';
import { ChatInputCommandInteraction, EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import { Command, COMMAND_TYPE } from "../command_types";
import { select_book_menu } from "../selection_menus";
import { wrap_str_in_code_block } from '../../utils/util';

export async function execute_view_book_info(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_menu(cmd);
}

export async function show_book_info(interaction: StringSelectMenuInteraction, isbn : string): Promise<void> {
  const book_info : BookInfo = (await fetch_book_info(isbn))!;

  if (!book_info) {
    await interaction.reply(
      wrap_str_in_code_block(
        `No book found with ISBN: ${isbn}` 
      )
    );
    return;
  }

  // fetch the cover image using the cover_id
  const response : EmbedBuilder = new EmbedBuilder()
    .setTitle(book_info.title)
    .setAuthor({name : book_info.author})
    .setImage(`https://covers.openlibrary.org/b/id/${book_info.cover_id}-M.jpg`)
    .setFooter({text : `Page Count : ${book_info.number_of_pages}`});
  
  await interaction.reply({ embeds : [response] });
}

export const view_book_info_command : Command =  {
  command: "view_book",
  command_type: COMMAND_TYPE.VIEW_BOOK_INFO,
  description: `view info about a specific book`,
  action: execute_view_book_info,
  requires_params : false
}