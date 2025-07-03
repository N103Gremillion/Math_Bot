import { BookInfo, fetch_book_info } from './../../tables/books';
import { ChatInputCommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { Command, COMMAND_TYPE } from "../command_types";
import { select_book_menu } from "../selection_menus";
import { BookField } from './BookField';
import { wrap_str_in_code_block } from '../../utils/util';

export async function execute_view_book_info(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_menu(cmd);
}

export async function show_book_info(interaction: StringSelectMenuInteraction, book_ID: number): Promise<void> {
  const book_info : BookInfo = (await fetch_book_info(book_ID))!;

  if (!book_info) {
    await interaction.reply("Book not found.");
    return;
  }

  await interaction.reply(
    wrap_str_in_code_block(
      `Title: ${book_info.title}
Author: ${book_info.author}
Pages: ${book_info.page_count}
Chapters: ${book_info.chapters}
Description: ${book_info.description}` 
    )
  );
}

export const view_book_info_command : Command =  {
  command: "view_book",
  command_type: COMMAND_TYPE.VIEW_BOOK_INFO,
  description: `view info about a specific book`,
  action: execute_view_book_info,
  requires_params : false
}