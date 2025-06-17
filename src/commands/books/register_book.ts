import { ChatInputCommandInteraction } from "discord.js";
import { COMMAND_TYPE, Command } from "../command_types";
import { wrap_str_in_code_block } from "../../utils/util";
import { insert_books_table } from "../../tables/books";

export async function execute_register_book (cmd : ChatInputCommandInteraction) : Promise<void> {
  await cmd.deferReply();

  const pending_response : string = `Trying to register book...\n`;
  await cmd.editReply(wrap_str_in_code_block(pending_response));

  await new Promise(resolve => setTimeout(resolve, 500));

  // ! prevents null sense it is already enfored when we created the options
  const title : string = cmd.options.getString("title")!;
  const author : string = cmd.options.getString("author")!;
  const pages : number = cmd.options.getInteger("pages")!;
  const chapters : number = cmd.options.getInteger("chapters")!;
  const description : string = cmd.options.getString("description")!;

  // try and add the book to books table
  const book_registered : boolean = await insert_books_table(title, author, pages, chapters, description);
  let resulting_response : string = "";

  if (book_registered) {
    resulting_response = `Successfully registered book \n`;
  } else {
    resulting_response = `Issue registering book \n`;
  }

  await cmd.editReply(wrap_str_in_code_block(resulting_response));
} 

export const register_book_command : Command = {
  command_type: COMMAND_TYPE.REGISTER_BOOK,
  command: "register_book",
  description: "Adds a book to the database",
  action: execute_register_book,
  requires_params : true
}