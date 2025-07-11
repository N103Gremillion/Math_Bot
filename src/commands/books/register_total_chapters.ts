import { add_total_chapters_to_book, BookInfo, fetch_book_and_author_info } from './../../tables/books';
import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, ModalSubmitInteraction, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command, COMMAND_TYPE } from "../command_types";
import { select_book_menu } from "../selection_menus";
import { ModalType } from "../modals";
import { BookField } from "./BookField";
import { get_book_info_str, wrap_str_in_code_block } from "../../utils/util";

export async function  execute_register_total_chapters(cmd : ChatInputCommandInteraction) {
  await select_book_menu(cmd);
}

export async function handle_total_chapters_modal_submission(
  book_ISBN : string, 
  total_chapters_str : string, 
  interaction : ModalSubmitInteraction
) : Promise<void> {
  
  // check for valid number for chapter total
  if (!total_chapters_str || isNaN(Number(total_chapters_str))) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Total Chapters must be a number.
Invalid input for Total Chapters: ${total_chapters_str}`
      )
    );
    return;
  }

  const total_chapters : number = Number(total_chapters_str);

  if (total_chapters <= 0) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Total Chapters must be greater than 0.
Invalid input for Total Chapters: ${total_chapters_str}`
      )
    );
    return;
  }

  if (!Number.isInteger(total_chapters)) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Total Chapters must be a whole number.
Invalid input for Total Chapters: ${total_chapters_str}`
      )
    );
    return;
  }

  // try to add the info to the database
  const registration_successful : boolean = await add_total_chapters_to_book(book_ISBN, total_chapters);
  const book : BookInfo = (await fetch_book_and_author_info(book_ISBN))!;
  const book_str : string = get_book_info_str(book);

  if (registration_successful) {
    await interaction.reply( 
      wrap_str_in_code_block(
        `============== Successful insert for total chapters ====================
${book_str}`
      )
    );
  } else {
    await interaction.reply(
      wrap_str_in_code_block(
        `============== Issue inserting total chapters ====================
Book ISBN: ${book_ISBN}.
Total Chapters: ${total_chapters}`
      )
    );
  }

}

export async function get_total_chapters(interaction : StringSelectMenuInteraction, book_ISBN : string) {
  
  const modal = new ModalBuilder()
  .setCustomId(`${ModalType.TotalChaptersInput}|${book_ISBN}`)
  .setTitle("Enter book info")
  .addComponents(
    // get components
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(BookField.TotalChapters)
        .setLabel("Total Chapters?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
      )
    );
  await interaction.showModal(modal)
}

export const register_total_chapters_command : Command = {
  command : "register_total_chapters",
  command_type : COMMAND_TYPE.REGISTER_TOTAL_CHAPTERS,
  description : "adds total chapter information to a selected book.",
  action : execute_register_total_chapters,
  requires_params : false
}