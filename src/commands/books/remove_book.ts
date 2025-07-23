import { ChatInputCommandInteraction, SlashCommandBuilder, StringSelectMenuInteraction } from "discord.js";
import { Command, CommandType, CommandStringType, default_command_builder } from "../command_types";
import { select_book_menu } from "../selection_menus";
import { get_authors_str, wrap_str_in_code_block } from "../../utils/util";
import { BookInfo, fetch_book_and_author_info, remove_book_from_database } from "../../tables/books";


export const remove_book_command : Command = {
  command : CommandStringType.REMOVE_BOOK,
  command_type : CommandType.REMOVE_BOOK,
  description : "remove a book from the database",
  action : execute_remove_book,
  command_builder : remove_book_command_builder
}

export function remove_book_command_builder(cmd : Command) : SlashCommandBuilder {
  return default_command_builder(cmd);
}

export async function execute_remove_book(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_menu(cmd);
}

export async function finish_executing_remove_book(interaction : StringSelectMenuInteraction, isbn : string) : Promise<void> {
  // try to remove the book
  const book_info : BookInfo | null = await (fetch_book_and_author_info(isbn))!; 

  if (book_info === null) {
    interaction.reply(
      wrap_str_in_code_block(
        `Issue fetching book info.
This is likely do to an invalid bookID.`
      )
    );
    return;
  }


  const successful_removal : boolean = await remove_book_from_database(isbn);

  if (successful_removal) {
    interaction.reply(
      wrap_str_in_code_block(
        `====================== Successful removal for ===========================
Title: ${book_info.title}
Author: ${get_authors_str(book_info.authors) ?? "Unknown"}
Pages: ${book_info.number_of_pages ?? "Unknown"}
Total Chapters: ${book_info.total_chapters ?? "Unknown"}` 
      )
    );
  } else {
    interaction.reply(
      wrap_str_in_code_block(
        `================== Issue removing book from database for =====================
Title: ${book_info.title}
Author: ${get_authors_str(book_info.authors) ?? "Unknown"}
Pages: ${book_info.number_of_pages ?? "Unknown"}
Total Chapters: ${book_info.total_chapters ?? "Unknown"}`
      )
    )
  }
}
