import { ChatInputCommandInteraction } from "discord.js";
import { COMMAND_TYPE, COMMAND_TYPE_STRING, Command } from "../command_types";
import { get_authors_str, wrap_str_in_code_block } from "../../utils/util";
import { BookInfo, fetch_books_and_authors_info, fetch_books_info } from "../../tables/books";

export async function execute_view_books (cmd : ChatInputCommandInteraction) : Promise<void> {

  await cmd.deferReply();

  const pending_response : string = `Fetching the registered books...\n`;
  await cmd.editReply(wrap_str_in_code_block(pending_response));

  await new Promise(resolve => setTimeout(resolve, 250));

  // try and add the book to books table
  const books_fetched : BookInfo[] = await fetch_books_and_authors_info();

  if (books_fetched.length === 0) {
    await cmd.editReply(
      wrap_str_in_code_block(
        `No books currently registered.`
      ) 
    );
    return;
  }

  let response = `📚 Books (${books_fetched.length}):\n\n`;

  for (let i = 0; i < books_fetched.length; i++) {
    const b : BookInfo | undefined = books_fetched[i];
    if (!b) continue;
    response += `${i + 1}.) ${b.title} | Pages: ${b.number_of_pages ?? "?"} | Authors: ${get_authors_str(b.authors)}\n`;
  }

  await cmd.editReply(wrap_str_in_code_block(response));
} 

export const view_books_command : Command = {
  command: COMMAND_TYPE_STRING.VIEW_BOOKS,
  command_type: COMMAND_TYPE.VIEW_BOOKS,
  description: "View all the registered books",
  action: execute_view_books,
  requires_params : false
}