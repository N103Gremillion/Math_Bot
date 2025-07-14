import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, ModalSubmitInteraction, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command, COMMAND_TYPE, COMMAND_TYPE_STRING } from "../command_types";
import { select_bookshelf_menu } from "../selection_menus";
import { ModalType } from "../modals";
import { BookshelfField } from "./BookshelfField";
import { get_user_id_from_interaction, wrap_str_in_code_block } from "../../utils/util";
import { fetch_page_count } from "../../tables/books";
import { update_cur_page, update_reading_state } from "../../tables/bookshelf";

export async function execute_start_reading(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_bookshelf_menu(cmd);
}

export async function handle_start_page_modal_submission(
  book_ISBN : string, 
  start_page : number, 
  interaction : ModalSubmitInteraction
) : Promise<void> {

  // check for valid input
  if (!Number.isInteger(start_page)) {
    interaction.reply(wrap_str_in_code_block("Must input a integer for the start page."))
    return;
  }

  const total_pages_in_book : number = await fetch_page_count(book_ISBN);

  if (total_pages_in_book === -1) {
    interaction.reply(
      wrap_str_in_code_block(
        `Issue getting total pages for isbn: ${book_ISBN}`
      )
    );
    return;
  }

  if (start_page < 1) {
    interaction.reply(
      wrap_str_in_code_block(
        `Start page must be above 0`
      )
    );
    return;
  }

  if (start_page > total_pages_in_book) {
    interaction.reply(
      wrap_str_in_code_block(
        `Start page must below the total pages in the book for
Start page: ${start_page}
Total pages: ${total_pages_in_book}`
      )
    );
    return;
  }

  const user_id : number = await get_user_id_from_interaction(interaction);
  const successful_update : boolean = await update_cur_page(user_id, book_ISBN, start_page);
  const successful_update2 : boolean = await update_reading_state(user_id, book_ISBN);

  if (successful_update && successful_update2) {
    interaction.reply(
      wrap_str_in_code_block(
        `Successfully start page of book.`
      )
    );
  } else {
    interaction.reply(
      wrap_str_in_code_block(
        `Issue inserting into bookshelf for commmand start_reading.`
      )
    );
  }
}

export async function get_start_reading_page(
  interaction : StringSelectMenuInteraction,
  book_ISBN : string
) : Promise<void> {

  const modal = new ModalBuilder()
  .setCustomId(`${ModalType.StartingPageInput}|${book_ISBN}`)
  .setTitle("Enter Chapter Details")
  .addComponents(
    // get components
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(BookshelfField.CurPage)
        .setLabel("What Page are you starting on ?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    )
  );
  await interaction.showModal(modal);
}

export const start_reading_command : Command = {
  command: COMMAND_TYPE_STRING.START_READING,
  command_type: COMMAND_TYPE.START_READING,
  description: "tag a book as reading so you can being track it's progress.",
  action: execute_start_reading,
  requires_params : false
}