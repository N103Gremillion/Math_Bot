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
  const edition : number = cmd.options.getInteger(BookField.Edition)!;

  // make sure values are valid to put in table
  if (edition <= 0) {
    cmd.reply(
      wrap_str_in_code_block(
        `Edition must be > 0.`
      ),
    );
    return;
  }

  if (pages <= 0) {
    cmd.reply(
      wrap_str_in_code_block(
        `Pages must be > 0.`
      ),
    );
    return;
  } else if (chapters <= 0) {
    cmd.reply(
      wrap_str_in_code_block(
        `Chapters must be positive numbers.`
      ),
    );
    return;
  }

  await cmd.deferReply();

  const pending_response : string = `Trying to register book...\n`;
  await cmd.editReply(wrap_str_in_code_block(pending_response));

  await new Promise(resolve => setTimeout(resolve, 250));

  // try and add the book to books table
  const book_registered : boolean = await insert_books_table(title, author, pages, chapters, description, edition);
  let resulting_response : string = "";

  if (book_registered) {
    resulting_response =
`=================== Insertion successful for =======================
Book Title: ${title}
Edition: ${edition}
Book Author: ${author}
Page Count: ${pages}
Chapter Count: ${chapters}
Description: ${description}`;
  } else {
    resulting_response = 
`=================== Insertion failed for =======================
Book Title: ${title}
Edition: ${edition}
Book Author: ${author}
Page Count: ${pages}
Chapter Count: ${chapters}
Description: ${description}`;
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