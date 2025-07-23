import { ChatInputCommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { Command, CommandType, CommandStringType } from "../command_types";
import { select_book_menu } from "../selection_menus";
import { check_user_registered, fetch_user_id } from "../../tables/users";
import { wrap_str_in_code_block } from "../../utils/util";
import { fetch_total_books_in_bookshelf, insert_into_bookshelf, is_book_in_bookshelf } from "../../tables/bookshelf";

const MAX_BOOKS_IN_BOOKSHELF : number = 5;

export async function execute_add_to_bookshelf(cmd : ChatInputCommandInteraction) : Promise<void> {
  select_book_menu(cmd);
}

export async function finish_executing_add_to_bookshelf(cmd : StringSelectMenuInteraction, book_isbn : string) : Promise<void> {
  
  const user_name : string  = cmd.user.username;
  const is_registered : boolean = await check_user_registered(user_name);

  if (!is_registered) {
    cmd.reply(
      wrap_str_in_code_block(
        `User: ${user_name} has not been registered.`
      )
    );
    return;
  }

  // check total books in bookshelf
  const user_id : number = await fetch_user_id(user_name);
  const total_books_in_bookshelf : number = await fetch_total_books_in_bookshelf(user_id);

  // prevent the adding to much
  if (total_books_in_bookshelf > MAX_BOOKS_IN_BOOKSHELF) {
    cmd.reply(
      wrap_str_in_code_block(
        `You have already registered the max number of books.
Max is ${MAX_BOOKS_IN_BOOKSHELF}.
use /remove_from_bookshelf to free up a slot. 
use /drop_bookshelf to completely empty your bookshelf.`
      )
    ); 
    return;
  }

  // dont add the book if it is already in the bookshelf
  const already_registered : boolean = await is_book_in_bookshelf(user_id, book_isbn);

  if (already_registered) {
    cmd.reply(
      wrap_str_in_code_block(
`This book is already registered.`
      )
    );
    return;
  } 

  // try and add to bookshelf
  const insert_successful : boolean = await insert_into_bookshelf(user_id, book_isbn);
  
  if (insert_successful) {
    cmd.reply(
      wrap_str_in_code_block(
        `Insertion Successful!!`
      )
    );
  } else {
    cmd.reply(
      wrap_str_in_code_block(
        `Insertion Unsuccessful!!`
      )
    );
  }

}

export const add_to_bookshelf_command : Command = {
  command: CommandStringType.ADD_TO_BOOKSHELF,
  command_type: CommandType.ADD_TO_BOOKSHELF,
  description: "Adds a book to your bookshelf.",
  action: execute_add_to_bookshelf,
  requires_params : false
}