import { ChatInputCommandInteraction } from "discord.js";
import { Command, COMMAND_TYPE, COMMAND_TYPE_STRING } from "../command_types";
import { wrap_str_in_code_block } from "../../utils/util";

const help_str: string = 
`****** Math Bot Help Menu ******
Overview: This bot helps you track your reading progress through various books.

🔹 Use /register_book to insert a book into the general database.
🔹 Start by registering your username with /register_user (this allows you to add books to your bookshelf).
🔹 Use /add_to_bookshelf to select and add a book to your personal shelf.
🔹 To explore book-related commands, try /ls — all view commands begin with the keyword "view".
🔹 You can contribute book data using commands like /register_total_chapters and /register_chapter.
🔹 After registering a book using its ISBN, the database will fetch basic information about the book.
🔹 Begin reading a book in your bookshelf with /start_reading.
🔹 Log your reading progress using /log_progress.
🔹 Additional commands let you view your progress and manage your books (use /ls to list all available commands).`;


export async function execute_help(cmd : ChatInputCommandInteraction) : Promise<void> {
  await cmd.reply(
    wrap_str_in_code_block(
      help_str
    )
  );
}

export const help_command : Command = {
  command : COMMAND_TYPE_STRING.HELP,
  command_type : COMMAND_TYPE.HELP,
  description : "tells information about how to use this bot effectively",
  action : execute_help,
  requires_params : false
}