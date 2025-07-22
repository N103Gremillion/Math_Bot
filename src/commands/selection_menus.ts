import { ActionRowBuilder, ChatInputCommandInteraction, MessageActionRowComponent, MessageFlags, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { BookInfo, fetch_book_count, fetch_books_and_authors_info, fetch_books_with_isbns } from "../tables/books";
import { get_chapter_info } from "./chapters/register_chapter";
import { show_book_info } from "./books/view_book_info";
import { show_chapters_in_book } from "./chapters/view_chapters";
import { get_authors_str, get_user_id_from_interaction, wrap_str_in_code_block } from "../utils/util";
import { ChapterInfo, fetch_chapters_in_book } from "../tables/chapters";
import { get_section_info } from "./sections/register_section";
import { finish_executing_remove_book } from "./books/remove_book";
import { get_total_chapters } from "./books/register_total_chapters";
import { COMMAND_TYPE, COMMAND_TYPE_STRING } from "./command_types";
import { finish_executing_add_to_bookshelf } from "./bookshelf/add_to_bookshelf";
import { finish_executing_remove_from_bookshelf } from "./bookshelf/remove_from_bookshelf";
import { BookshelfInfo, fetch_books_users_reading, fetch_bookshelf_state } from "../tables/bookshelf";
import { get_start_reading_page } from "./bookshelf/start_reading";
import { BOOKS_PER_PAGE, finish_executing_view_books } from "./books/view_books";
import { get_pages_read_in_book } from "./progress_logs/log_progress";
import { continue_executing_view_logs, LOGS_PER_PAGE } from "./progress_logs/view_logs";
import { fetch_logs_count_for_book } from "../tables/progress_logs";
import { continue_executing_view_progress_graph } from "./progress_logs/view_progress_graph";

export enum SelectionMenuType {
  SelectBook = "select_book",
  SelectChapter = "select_chapter",
  SelectFromBookshelf = "select_from_bookshelf",
  SelectPageOfBooks = "select_page_of_books",
  SelectBookUsersReading = "select_book_users_reading",
  SelectPageOfBooksLogs = "select_page_of_books_logs"
}

export async function handle_menu_select(interaction : StringSelectMenuInteraction) : Promise<void> {
  if (!interaction.isStringSelectMenu()) return;

  const [type, command_type] = interaction.customId.split("|");

  if (type === SelectionMenuType.SelectBook) {
    await handle_select_book_submission(interaction, command_type);
  } 
  else if (type === SelectionMenuType.SelectChapter) {
    await handle_select_chapter_submission(interaction, command_type);
  }
  else if (type === SelectionMenuType.SelectFromBookshelf) {
    await handle_select_bookshelf_submission(interaction, command_type);
  }
  else if (type === SelectionMenuType.SelectPageOfBooks) {
    await handle_select_page_of_books(interaction);
  }
  else if (type === SelectionMenuType.SelectBookUsersReading) {
    await handle_select_book_users_reading(interaction, command_type);
  }
  else if (type === SelectionMenuType.SelectPageOfBooksLogs) {
    const [type, command_type, book_isbn] = interaction.customId.split("|");
    await handle_select_page_of_books_logs(interaction, command_type, book_isbn);
  }
  else {
    await interaction.reply({
      content: `Unhandled interaction type: ${type}`,
      ephemeral: true,
    });
  }
}

async function handle_select_page_of_books_logs(
  interaction : StringSelectMenuInteraction, 
  command_type : string | undefined,
  book_isbn : string |undefined
) : Promise<void> {
  const page_str : string | undefined = interaction.values[0];

  if (!page_str) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Could not pull of the page string from page_of_books_logs selection.`
      )
    )
    return;
  }

  if (!book_isbn) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Could not pull of the book_isbn from page_of_books_logs selection.`
      )
    )
    return;
  }

  const page : number = +page_str;

  if (!Number.isInteger(page)) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Page string was not an interger for page_of_books_logs selection.`
      )
    )
    return;
  }

  if (command_type === COMMAND_TYPE_STRING.VIEW_LOGS) {
    await continue_executing_view_logs(page, book_isbn, interaction);
  } else {
    await interaction.reply(
      wrap_str_in_code_block(
        `Unsupported command type for page_of_books_logs selection.`
      )
    )
    return;
  }
}

async function handle_select_book_users_reading(
  interaction : StringSelectMenuInteraction, 
  command_type : string | undefined
) : Promise<void> {
  const book_isbn : string | undefined = interaction.values[0];

  if (!book_isbn) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Could not extract isbn from the book selection interaction.`
      )
    );
    return;
  }

  if (command_type === COMMAND_TYPE_STRING.LOG_PROGRESS) {
    await get_pages_read_in_book(interaction, book_isbn);
  }
  else if (command_type === COMMAND_TYPE_STRING.VIEW_LOGS) {
    await select_page_of_books_logs(interaction, command_type,  book_isbn);
  }
  else if (command_type === COMMAND_TYPE_STRING.VIEW_PROGRESS_GRAPH) {
    await continue_executing_view_progress_graph(interaction, book_isbn);
  }
  else {
    await interaction.reply(
      wrap_str_in_code_block(
        `Unhandled command type for this interaction.`
      )
    );
  }
}

async function handle_select_page_of_books(interaction : StringSelectMenuInteraction) {
  // pull of the value they submitted
  const page_number_str : string | undefined = interaction.values[0];
   
  if (!page_number_str) {
    interaction.reply (
      wrap_str_in_code_block(
        `Selected page was undefined.`
      )
    );
    return;
  }

  const page_num : number = +page_number_str;

  if (!page_num) {
    interaction.reply(
      wrap_str_in_code_block(
        `Page number selected is not a valid number.`
      )
    );
    return;
  }

  await finish_executing_view_books(interaction, page_num);
}

async function  handle_select_bookshelf_submission(
  interaction : StringSelectMenuInteraction, 
  command_type : string | undefined
) : Promise<void> {
  // pull off the ISBN of the book
  const book_ISBN : string | undefined = interaction.values[0];

  if (!book_ISBN) {
    interaction.reply(wrap_str_in_code_block("Could not pull of book_ISBN from sleection for select_from_bookshelf menu."));
    return;
  }

  if (command_type === COMMAND_TYPE_STRING.REMOVE_FROM_BOOKSHELF) {
    await finish_executing_remove_from_bookshelf(interaction, book_ISBN);
  } else if (command_type === COMMAND_TYPE_STRING.START_READING) {
    await get_start_reading_page(interaction, book_ISBN);
  }
}

async function  handle_select_chapter_submission(
  interaction : StringSelectMenuInteraction, 
  command_type : string | undefined
) : Promise<void> {

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

async function handle_select_book_submission(
  interaction : StringSelectMenuInteraction, 
  command_type : string | undefined
) : Promise<void> {
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

export async function select_page_of_books_logs(
  interaction : StringSelectMenuInteraction, 
  command_type : string,
  book_isbn : string
) : Promise<void> {

  // get the total number of logs for this book
  const user_id : number = await get_user_id_from_interaction(interaction);
  const logs_count : number = await fetch_logs_count_for_book(book_isbn, user_id);
  const num_of_pages : number = Math.ceil(logs_count / LOGS_PER_PAGE);
  const options : {label : string, value : string}[] = [];

  for (let i = 0; i < num_of_pages; i++) {
    options.push({
      label : `Page ${i + 1}`,
      value : `${i + 1}`
    })
  }

  const menu : StringSelectMenuBuilder = new StringSelectMenuBuilder()
    .setCustomId(`${SelectionMenuType.SelectPageOfBooksLogs}|${command_type}|${book_isbn}`)
    .setPlaceholder("Select page of logs. (newest to oldest)")
    .addOptions(options);
  
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

  await interaction.update({
    content: `Which book are you logging for? `,
    components: [row],
  })
}

export async function select_book_users_reading(cmd : ChatInputCommandInteraction) : Promise<void> {
  // get the books that the user is currently reading
  const user_id : number = await get_user_id_from_interaction(cmd);
  const books_reading_isbns : BookshelfInfo[] = await fetch_books_users_reading(user_id);
  const books_reading_info : BookInfo[] = await fetch_books_with_isbns(books_reading_isbns);

  if (books_reading_info.length === 0) {
    cmd.reply(
      wrap_str_in_code_block(
        `You currnetly have no books registerd as reading.`
      )
    );
    return;
  }

  const menu : StringSelectMenuBuilder = new StringSelectMenuBuilder()
    .setCustomId(`${SelectionMenuType.SelectBookUsersReading}|${cmd.commandName}`)
    .setPlaceholder("Which book are you logging for?")
    .addOptions(
      books_reading_info.map(book => ({
      label: `${book.title} by ${get_authors_str(book.authors)}`,
      value: `${book.isbn}`
    })));
  
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

  await cmd.reply({
    content: `Which book are you logging for? `,
    components: [row],
  }) 
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

export async function select_page_of_books(cmd : ChatInputCommandInteraction) : Promise<void> {
  const total_books : number = await fetch_book_count();
  
  if (total_books === -1) {
    cmd.reply(
      wrap_str_in_code_block(
        `Issue fetching the number of books from database.`
      )
    );
  } else if (total_books === 0) {
    cmd.reply(
      wrap_str_in_code_block(
        `No books are currently registered.`
      )
    );
  }

  const total_pages : number = Math.ceil(total_books / BOOKS_PER_PAGE)
  const options : {label : string, value : string}[] = [];

  for (let i = 0; i < total_pages; i++) {
    options.push({
      label : `Page ${i + 1}`,
      value : `${i + 1}`
    });
  }

  const selection_menu : StringSelectMenuBuilder = new StringSelectMenuBuilder()
    .setCustomId(`${SelectionMenuType.SelectPageOfBooks}|${cmd.commandName}`)
    .setPlaceholder(`Select Page, each page has up to ${BOOKS_PER_PAGE} books.`)
    .addOptions(
      options
    );
  
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selection_menu);

  await cmd.reply({content : "What page would you like to see?", components: [row]});
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
  const books : BookshelfInfo[] = await fetch_bookshelf_state(user_id);
  const books_info : BookInfo[] = await fetch_books_with_isbns(books); 

  if (books.length === 0 || books_info.length === 0) {
    cmd.reply(
      wrap_str_in_code_block(
        `No books are registered in your bookshelf.`
      )
    );
    return;
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
