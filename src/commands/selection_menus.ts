import { ActionRowBuilder, ChatInputCommandInteraction, MessageFlags, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { BookInfo, fetch_books_info } from "../tables/books";
import { get_chapter_info } from "./chapters/register_chapter";
import { show_book_info } from "./books/view_book_info";
import { show_chapters_in_book } from "./chapters/view_chapters";
import { wrap_str_in_code_block } from "../utils/util";
import { ChapterInfo, fetch_chapters_in_book } from "../tables/chapters";
import { get_section_info } from "./sections/register_section";
import { finish_executing_remove_book } from "./books/remove_book";

export enum SelectionMenuType {
  SelectBook = "select_book",
  SelectChapter = "select_chapter"
}

export async function handle_menu_select(interaction : StringSelectMenuInteraction) : Promise<void> {
  if (!interaction.isStringSelectMenu()) return;

  const [type, command_type] = interaction.customId.split("|");

  if (type === SelectionMenuType.SelectBook) {

    // pull off the ID of the book
    const book_ISBN : string | undefined = interaction.values[0];

    // null check for the id
    if (book_ISBN === undefined){
      await interaction.reply({
        content: "Something went wrong — no book was selected. Please try again.",
      });
      return;
    }

    if (command_type === "register_chapter") {
      await get_chapter_info(interaction, book_ISBN);
    } 
    else if (command_type === "view_book") {
      await show_book_info(interaction, book_ISBN); 
    }
    else if (command_type === "view_chapters") {
      await show_chapters_in_book(interaction, book_ID_num);
    }
    else if (command_type === "register_section") {
      await select_chapter_menu(interaction, book_ID_num, command_type);
    }
    else if (command_type === "remove_book") {
      await finish_executing_remove_book(interaction, book_ISBN);
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
    const [book_Id_string, chapter_number_string] : string[] | undefined = interaction.values[0].split(":");

    const book_ID = Number(book_Id_string);
    const chapter_number = Number(chapter_number_string);

    // null check for the id
    if (book_ID === undefined || chapter_number === undefined){
      await interaction.reply({
        content: "bookId or chapter_number is undefined",
      });
      return;
    } else if (isNaN(book_ID) || isNaN(chapter_number)) {

    }

    if (command_type === "register_section") {
      await get_section_info(interaction, book_ID, chapter_number);
    }
    else {
      await interaction.reply({
        content : `Unknown command: ${command_type}`
      });
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
  book_ID : number,
  command_type : string
) : Promise<void> {
  
  // get currently regisetered books [title : string, author : string]
  const chapters: ChapterInfo[] = await fetch_chapters_in_book(book_ID);

  // Create dropdown menu
  const select_menu : StringSelectMenuBuilder = new StringSelectMenuBuilder()
  .setCustomId(`${SelectionMenuType.SelectChapter}|${command_type}`)
  .setPlaceholder('Choose a chapter')
  .addOptions(
    chapters.map(chapter => ({
    label: `Chapter ${chapter.chapter_number}: ${chapter.chapter_name}`,
    value: `${book_ID}:${chapter.chapter_number}`
  })));
  
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select_menu);

  await interaction.reply({
    content: `Please select the chapter `,
    components: [row],
    flags: MessageFlags.Ephemeral
  })
}

export async function select_book_menu(cmd : ChatInputCommandInteraction) : Promise<void> {
  // get currently regisetered books [title : string, author : string]
  const books: BookInfo[] = await fetch_books_info();

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
    label: `${book.title} by ${book.author}`,
    value: `${book.isbn}`
  })));
  
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select_menu);

  await cmd.reply({
    content: `Please select the book `,
    components: [row],
    flags: MessageFlags.Ephemeral
  })
}