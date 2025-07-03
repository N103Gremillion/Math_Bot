import { ActionRowBuilder, ChatInputCommandInteraction, Interaction, MessageFlags, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { BookInfo, fetch_books_and_authors } from "../tables/books";
import { get_chapter_info } from "./chapters/register_chapter";
import { show_book_info } from "./books/view_book_info";
import { show_chapters_in_book } from "./chapters/view_chapters";
import { wrap_str_in_code_block } from "../utils/util";

export enum SelectionMenuType {
  SelectBook = "select_book",
}

export async function handle_menu_select(interaction : StringSelectMenuInteraction) : Promise<void> {
  if (!interaction.isStringSelectMenu()) return;

  const [type, command_type] = interaction.customId.split("|");

  if (type === SelectionMenuType.SelectBook) {

    // pull off the ID of the book
    const book_ID : string | undefined = interaction.values[0];
    const book_ID_num : number = Number(book_ID)
    // null check for the id
    if (book_ID === undefined || isNaN(book_ID_num)){
      await interaction.reply({
        content: "Something went wrong — no book was selected. Please try again.",
      });
      return;
    }

    if (command_type === "register_chapter") {
      await get_chapter_info(interaction, book_ID);
    } 
    else if (command_type === "view_book") {
      await show_book_info(interaction, book_ID_num); 
    }
    else if (command_type === "view_chapters") {
      await show_chapters_in_book(interaction, book_ID_num);
    }
    else {
      await interaction.reply({
        content : `Unknown command: ${command_type}`
      });
    }

  } else {
    await interaction.reply({
      content: `Unhandled interaction type: ${type}`,
      ephemeral: true,
    });
  }
}

export async function select_book_menu(cmd : ChatInputCommandInteraction) : Promise<void> {
  // get currently regisetered books [title : string, author : string]
  const books: BookInfo[] = await fetch_books_and_authors();

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
    value: `${book.id}`
  })));
  
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select_menu);

  await cmd.reply({
    content: `Please select the book `,
    components: [row],
    flags: MessageFlags.Ephemeral
  })
}