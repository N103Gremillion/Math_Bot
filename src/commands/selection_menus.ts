import { ActionRowBuilder, ChatInputCommandInteraction, Interaction, MessageFlags, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { BookInfo, fetch_books_and_authors } from "../tables/books";
import { get_chapter_info } from "./chapters/register_chapter";

export enum SelectionMenuType {
  SelectBook = "select_book",
}

export async function handle_menu_select(interaction : StringSelectMenuInteraction) : Promise<void> {
  if (!interaction.isStringSelectMenu()) return;

  const [type, command_type] = interaction.customId.split("|");

  if (type === SelectionMenuType.SelectBook) {

    // pull off the ID of the book
    const book_ID : string | undefined = interaction.values[0];
    
    // null check for the id
    if (book_ID === undefined){
      await interaction.reply({
        content: "Something went wrong — no book was selected. Please try again.",
      });
      return;
    }

    if (command_type === "register_chapter") {
      await get_chapter_info(interaction, book_ID);
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

  // Create dropdown menu
  const selectMenu : StringSelectMenuBuilder = new StringSelectMenuBuilder()
  .setCustomId(`${SelectionMenuType.SelectBook}|${cmd.commandName}`)
  .setPlaceholder('Choose a book')
  .addOptions(
    books.map(book => ({
    label: `${book.title} by ${book.author}`,
    value: `${book.id}`
  })));
  
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  await cmd.reply({
    content: `Please select the book `,
    components: [row],
    flags: MessageFlags.Ephemeral
  })
}