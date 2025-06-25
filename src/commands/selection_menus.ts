import { ActionRowBuilder, ChatInputCommandInteraction, Interaction, MessageFlags, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { BookInfo, fetch_books_and_authors } from "../tables/books";
import { get_chapter_info } from "./chapters/register_chapter";

export async function handle_menu_select(interaction : StringSelectMenuInteraction) : Promise<void> {

  if (!interaction.isStringSelectMenu()) return;

  // pull off the id of the interaction to determine appropriate response
  const [type, context] = interaction.customId.split("|");
  if (type === "select_book") {
    const book_selected : string | undefined = interaction.values[0];

    if (context === "register_chapter") {
      get_chapter_info(interaction, book_selected);
    }

  } else {

  }
}

export async function select_book_menu(cmd : ChatInputCommandInteraction) : Promise<void> {
  // get currently regisetered books [title : string, author : string]
  const books: BookInfo[] = await fetch_books_and_authors();

  // Create dropdown menu
  const selectMenu : StringSelectMenuBuilder = new StringSelectMenuBuilder()
  .setCustomId(`select_book|${cmd.commandName}`)
  .setPlaceholder('Choose a book')
  .addOptions(
    books.map(book => ({
    label: `${book.title} by ${book.author}`,
    value: book.title
  })));
  
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  await cmd.reply({
    content: `Please select the book `,
    components: [row],
    flags: MessageFlags.Ephemeral
  })
}