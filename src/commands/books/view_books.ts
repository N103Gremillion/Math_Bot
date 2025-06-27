import { ChatInputCommandInteraction } from "discord.js";
import { COMMAND_TYPE, Command } from "../command_types";
import { wrap_str_in_code_block } from "../../utils/util";
import { BookInfo, fetch_books_and_authors } from "../../tables/books";

export async function execute_view_books (cmd : ChatInputCommandInteraction) : Promise<void> {

  await cmd.deferReply();

  const pending_response : string = `Fetching the registered books...\n`;
  await cmd.editReply(wrap_str_in_code_block(pending_response));

  await new Promise(resolve => setTimeout(resolve, 250));

  // try and add the book to books table
  const books_fetched : BookInfo[] = await fetch_books_and_authors();
  let resulting_response : string = "";
  let book_num : number = 1;

  books_fetched.forEach((book : BookInfo) => {
      resulting_response += `${book_num}.) ${book.title} by ${book.author} \n`;
      book_num++;
  });


  await cmd.editReply(wrap_str_in_code_block(resulting_response));
} 

export const view_books_command : Command = {
  command: "view_books",
  command_type: COMMAND_TYPE.VIEW_BOOKS,
  description: "View all the registered books",
  action: execute_view_books,
  requires_params : false
}