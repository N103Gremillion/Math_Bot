import { BookInfo, fetch_book_and_author_info } from './../../tables/books';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, StringSelectMenuInteraction } from "discord.js";
import { Command, CommandType, CommandStringType, default_command_builder } from "../command_types";
import { select_book_menu } from "../selection_menus";
import { wrap_str_in_code_block } from '../../utils/util';
import { get_book_embed } from '../embeds';

export const view_book_info_command : Command =  {
  command: CommandStringType.VIEW_BOOK_INFO,
  command_type: CommandType.VIEW_BOOK_INFO,
  description: `view info about a specific book`,
  action: execute_view_book_info,
  command_builder : view_book_info_command_builder
}

export function view_book_info_command_builder(cmd : Command) : SlashCommandBuilder {
  return default_command_builder(cmd);
}

export function get_cover_url_small(cover_id : number | undefined) : string {
  if (!cover_id) {
    return ""
  }

  return `https://covers.openlibrary.org/b/id/${cover_id}-S.jpg`;
}

export function get_cover_url_medium(cover_id : number | undefined) : string {
  if (!cover_id) {
    return ""
  }

  return `https://covers.openlibrary.org/b/id/${cover_id}-M.jpg`;
}

export function get_cover_url_large(cover_id : number | undefined) : string {
  if (!cover_id) {
    return ""
  }

  return `https://covers.openlibrary.org/b/id/${cover_id}-L.jpg`;
}

export async function execute_view_book_info(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_menu(cmd);
}

export async function show_book_info(interaction: StringSelectMenuInteraction, isbn : string): Promise<void> {
  console.log(isbn);

  const book_info : BookInfo = (await fetch_book_and_author_info(isbn))!;

  console.log(book_info);

  if (!book_info) {
    await interaction.reply(
      wrap_str_in_code_block(
        `No book found with ISBN: ${isbn}` 
      )
    );
    return;
  }
  // fetch the cover image using the cover_id
  const response : EmbedBuilder = get_book_embed(book_info);
  await interaction.reply({ embeds : [response] });
}

