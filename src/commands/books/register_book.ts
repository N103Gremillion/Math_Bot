import { ChatInputCommandInteraction } from "discord.js";
import { COMMAND_TYPE, Command } from "../command_types";
import { wrap_str_in_code_block } from "../../utils/util";
import { insert_books_table } from "../../tables/books";
import { BookField } from "./BookField";

export async function execute_register_book (cmd : ChatInputCommandInteraction) : Promise<void> {

  // ! prevents null sense it is already enfored when we created the options
  const title : string = cmd.options.getString(BookField.BookTitle)!;
  const author : string = cmd.options.getString(BookField.Author)!;
  const pages : number = cmd.options.getInteger(BookField.PageCount)!;
  const chapters : number = cmd.options.getInteger(BookField.TotalChapters)!;
  const description : string = cmd.options.getString(BookField.Description)!;

  // make sure values are valid to put in table
  if (pages <= 0 || chapters <= 0) {
    cmd.reply({
      content: "Pages and chapters must be positive numbers.",
      ephemeral: true
    });
    return;
  }

  await cmd.deferReply();

  const pending_response : string = `Trying to register book...\n`;
  await cmd.editReply(wrap_str_in_code_block(pending_response));

  await new Promise(resolve => setTimeout(resolve, 250));

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
  command: "register_book",
  command_type: COMMAND_TYPE.REGISTER_BOOK,
  description: "Adds a book to the database",
  action: execute_register_book,
  requires_params : true
}