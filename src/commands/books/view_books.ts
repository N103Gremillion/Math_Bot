import { ChatInputCommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { CommandType, CommandStringType, Command } from "../command_types";
import { get_authors_str, wrap_str_in_code_block } from "../../utils/util";
import { BookInfo, fetch_books_and_authors_on_page } from "../../tables/books";
import { select_page_of_books } from "../selection_menus";

// this is the number of books to fetch per page when viewing books table
export const BOOKS_PER_PAGE : number = 10;

export async function execute_view_books (cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_page_of_books(cmd);
} 

export async function finish_executing_view_books(interaction : StringSelectMenuInteraction, page_num : number) : Promise<void> {
  await interaction.deferReply();

  const pending_response : string = `Fetching the registered books on page ${page_num}...\n`;
  await interaction.editReply(wrap_str_in_code_block(pending_response));

  await new Promise(resolve => setTimeout(resolve, 250));

  // view all the books on the appropriate page
  const books_fetched : BookInfo[] = await fetch_books_and_authors_on_page(page_num, BOOKS_PER_PAGE);

  if (books_fetched.length === 0) {
    await interaction.editReply(
      wrap_str_in_code_block(
        `No books currently registered.`
      ) 
    );
    return;
  }

  const starting_book_num : number = (page_num - 1) * BOOKS_PER_PAGE;
  const ending_book_num : number = (page_num) * BOOKS_PER_PAGE;

  let response = `📚 Books (${starting_book_num + 1} - ${ending_book_num}):\n\n`;

  for (let i = 0; i < books_fetched.length; i++) {
    const b : BookInfo | undefined = books_fetched[i];
    if (!b) continue;
    response += `${starting_book_num + i + 1}.) ${b.title} | Pages: ${b.number_of_pages ?? "?"} | Authors: ${get_authors_str(b.authors)}\n`;
  }

  await interaction.editReply(wrap_str_in_code_block(response));
}

export const view_books_command : Command = {
  command: CommandStringType.VIEW_BOOKS,
  command_type: CommandType.VIEW_BOOKS,
  description: "View a page of registered books",
  action: execute_view_books,
  requires_params : false
}