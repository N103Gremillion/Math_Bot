import { ActionRowBuilder, ChatInputCommandInteraction, MessageFlags, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { BookInfo, fetch_books_and_authors_info, fetch_books_with_isbns } from "../tables/books";
import { get_chapter_info } from "./chapters/register_chapter";
import { show_book_info } from "./books/view_book_info";
import { show_chapters_in_book } from "./chapters/view_chapters";
import { get_authors_str, get_user_id_from_interaction, wrap_str_in_code_block } from "../utils/util";
import { ChapterInfo, fetch_chapters_in_book } from "../tables/chapters";
import { get_section_info } from "./sections/register_section";
import { finish_executing_remove_book } from "./books/remove_book";
import { get_total_chapters } from "./books/register_total_chapters";
import { COMMAND_TYPE_STRING } from "./command_types";
import { finish_executing_add_to_bookshelf } from "./bookshelf/add_to_bookshelf";
import { finish_executing_remove_from_bookshelf } from "./bookshelf/remove_from_bookshelf";
import { BookshelfInfo, fetch_bookshelf_isbns, fetch_total_books_in_bookshelf } from "../tables/bookshelf";
import { fetch_user_id } from "../tables/users";

export enum SelectionMenuType {
  SelectBook = "select_book",
  SelectChapter = "select_chapter",
  SelectFromBookshelf = "select_from_bookshelf",
}

export async function handle_menu_select(interaction : StringSelectMenuInteraction) : Promise<void> {
  if (!interaction.isStringSelectMenu()) return;

  const [type, command_type] = interaction.customId.split("|");

  if (type === SelectionMenuType.SelectBook) {

    // pull off the ISBN of the book
    const book_ISBN : string | undefined = interaction.values[0];

    // null check for the id
    if (book_ISBN === undefined){
      await interaction.reply({
        content: "Something went wrong — no book was selected. Please try again.",
      });
      return;
    }

    if (command_type === COMMAND_TYPE_STRING.REGISTER_CHAPTER) {
      await get_chapter_info(interaction, book_ISBN);
    } 
    else if (command_type === COMMAND_TYPE_STRING.VIEW_BOOK_INFO) {
      await show_book_info(interaction, book_ISBN); 
    }
    else if (command_type === COMMAND_TYPE_STRING.REGISTER_TOTAL_CHAPTERS) {
      await get_total_chapters(interaction, book_ISBN);
    }
    else if (command_type === COMMAND_TYPE_STRING.VIEW_CHAPTERS) {
      await show_chapters_in_book(interaction, book_ISBN);
    }
    else if (command_type === COMMAND_TYPE_STRING.REGISTER_SECTION) {
      await select_chapter_menu(interaction, book_ISBN, command_type);
    }
    else if (command_type === COMMAND_TYPE_STRING.REMOVE_BOOK) {
      await finish_executing_remove_book(interaction, book_ISBN);
    }
    else if (command_type === COMMAND_TYPE_STRING.ADD_TO_BOOKSHELF) {
      await finish_executing_add_to_bookshelf(interaction, book_ISBN);
    }
    else {
      await interaction.reply({
        content : `Unknown command: ${command_type}`
      });
    }

  } 
  else if (type === SelectionMenuType.SelectChapter) {

    if (interaction.values === undefined || interaction.values[0] === undefined){
      await interaction.reply(
        wrap_str_in_code_block(
          `Issue extracting book id and chapter number from chapter selection`
        )
      );
      return;
    }
    
    // pull off the book ID and the chapter number
    const [book_ISBN, chapter_number_string] : string[] | undefined = interaction.values[0].split(":");

    const chapter_number = Number(chapter_number_string);

    // null check for the id
    if (!book_ISBN || !chapter_number ){
      await interaction.reply({
        content: "bookId or chapter_number is undefined",
      });
      return;
    } else if (isNaN(chapter_number)) {
      await interaction.reply({
        content: "chapter_number is not a number",
      });
      return;
    }

    if (command_type === COMMAND_TYPE_STRING.REGISTER_SECTION) {
      await get_section_info(interaction, book_ISBN, chapter_number);
    }
    else {
      await interaction.reply({
        content : `Unknown command: ${command_type}`
      });
    }
  }
  else if (type === SelectionMenuType.SelectFromBookshelf) {

    // pull off the ISBN of the book
    const book_ISBN : string | undefined = interaction.values[0];

    if (!book_ISBN) {
      interaction.reply(wrap_str_in_code_block("Could not pull of book_ISBN from sleection for select_from_bookshelf menu."));
      return;
    }

    if (command_type === COMMAND_TYPE_STRING.REMOVE_FROM_BOOKSHELF) {
      await finish_executing_remove_from_bookshelf(interaction, book_ISBN);
    }

  }
  else {
    await interaction.reply({
      content: `Unhandled interaction type: ${type}`,
      ephemeral: true,
    });
  }
}

async function select_chapter_menu(
  interaction : ChatInputCommandInteraction | StringSelectMenuInteraction, 
  book_isbn : string,
  command_type : string
) : Promise<void> {
  
  // get currently regisetered books [title : string, author : string]
  const chapters: ChapterInfo[] = await fetch_chapters_in_book(book_isbn);

  // Create dropdown menu
  const select_menu : StringSelectMenuBuilder = new StringSelectMenuBuilder()
  .setCustomId(`${SelectionMenuType.SelectChapter}|${command_type}`)
  .setPlaceholder('Choose a chapter')
  .addOptions(
    chapters.map(chapter => ({
    label: `Chapter ${chapter.chapter_number}: ${chapter.chapter_name}`,
    value: `${book_isbn}:${chapter.chapter_number}`
  })));
  
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select_menu);

  if (interaction.isStringSelectMenu()) {
    await interaction.update({
      content: `Please select the chapter`,
      components: [row]
    });
  } else {
    await interaction.reply({
      content: `Please select the chapter`,
      components: [row],
      ephemeral: true
    });
  }
}

export async function select_book_menu(cmd : ChatInputCommandInteraction) : Promise<void> {
  // get currently regisetered books [title : string, author : string]
  const books: BookInfo[] = await fetch_books_and_authors_info();

  if (books.length == 0) {
    await cmd.reply(
      wrap_str_in_code_block(
        `No books currently registered.`
      )
    );
    return;
  }

  // Create dropdown menu
  const select_menu : StringSelectMenuBuilder = new StringSelectMenuBuilder()
  .setCustomId(`${SelectionMenuType.SelectBook}|${cmd.commandName}`)
  .setPlaceholder('Choose a book')
  .addOptions(
    books.map(book => ({
    label: `${book.title} by ${get_authors_str(book.authors)}`,
    value: `${book.isbn}`
  })));
  
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select_menu);

  await cmd.reply({
    content: `Please select the book `,
    components: [row],
    flags: MessageFlags.Ephemeral
  })
}

export async function select_bookshelf_menu(cmd : ChatInputCommandInteraction) : Promise<void> {
  const user_id : number = await get_user_id_from_interaction(cmd);
  const books : BookshelfInfo[] = await fetch_bookshelf_isbns(user_id);
  const books_info : BookInfo[] = await fetch_books_with_isbns(books); 

  if (books.length === 0 || books_info.length === 0) {
    cmd.reply(
      wrap_str_in_code_block(
        `No books are registered in your bookshelf.`
      )
    );
  }

  // Create dropdown menu for bookshelf
  const select_menu : StringSelectMenuBuilder = new StringSelectMenuBuilder()
  .setCustomId(`${SelectionMenuType.SelectFromBookshelf}|${cmd.commandName}`)
  .setPlaceholder('Choose a book')
  .addOptions(
    books_info.map(book => ({
    label: `${book.title} by ${get_authors_str(book.authors)}`,
    value: `${book.isbn}`
  })));
  
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select_menu);

  await cmd.reply({
    content: `Please select the book `,
    components: [row]
  })

}