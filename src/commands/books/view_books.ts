import { ChatInputCommandInteraction } from "discord.js";
import { COMMAND_TYPE, Command } from "../command_types";
import { wrap_str_in_code_block } from "../../utils/util";
import { BookInfo, fetch_books_info } from "../../tables/books";

export async function execute_view_books (cmd : ChatInputCommandInteraction) : Promise<void> {

  await cmd.deferReply();

  const pending_response : string = `Fetching the registered books...\n`;
  await cmd.editReply(wrap_str_in_code_block(pending_response));

  await new Promise(resolve => setTimeout(resolve, 250));

  // try and add the book to books table
  const books_fetched : BookInfo[] = await fetch_books_info();

  if (books_fetched.length === 0) {
    await cmd.editReply(
      wrap_str_in_code_block(
        `No books currently registered.`
      ) 
    );
    return;
  }

  let response = `📚 Registered Books (${books_fetched.length}):\n\n`;

  books_fetched.forEach((book, idx) => {
    response += 
      `${idx + 1}.) ${book.title}\n` +
      `    Author     : ${book.author}\n` +
      `    Page Count : ${book.page_count ?? "N/A"}\n` +
      `    Chapters   : ${Array.isArray(book.chapters) ? book.chapters.length : book.chapters ?? "N/A"}\n` +
      `    ID         : ${book.id}\n\n`;
  });

  await cmd.editReply(wrap_str_in_code_block(response));
} 

export const view_books_command : Command = {
  command: "view_books",
  command_type: COMMAND_TYPE.VIEW_BOOKS,
  description: "View all the registered books",
  action: execute_view_books,
  requires_params : false
}