import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, ModalSubmitInteraction, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command, CommandType, CommandStringType } from "../command_types";
import { select_book_users_reading } from "../selection_menus";
import { get_user_id_from_interaction, wrap_str_in_code_block } from "../../utils/util";
import { ModalType } from "../modals";
import { BookStatusStr, fetch_cur_page_in_book, update_book_status, update_cur_page } from "../../tables/bookshelf";
import { fetch_page_count } from "../../tables/books";
import { log_book_progress } from "../../tables/progress_logs";

export async function execute_log_progress(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_users_reading(cmd);
}

export async function handle_logging_page_input_submission(
  book_ISBN : string, 
  pages_read_str : string, 
  interaction : ModalSubmitInteraction
) : Promise<void> {
  // first check to make sure the pages input is valid
  const pages_read : number = +pages_read_str;

  console.log(pages_read);

  if (!pages_read || !Number.isInteger(pages_read)) {
    await interaction.reply(  
      wrap_str_in_code_block(
        `Input must be a integer.`
      )
    );
    return;
  }

  if (pages_read < 0) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Input must be positive.`
      )
    );
    return;
  }

  const user_id : number = await get_user_id_from_interaction(interaction);
  const start_page : number = await fetch_cur_page_in_book(user_id, book_ISBN);
  let end_page : number = start_page + pages_read;
  const last_page : number = await fetch_page_count(book_ISBN);
  
  if (end_page > last_page) {
    end_page = last_page;
  }
  
  // update current page in bookshelf
  const page_updated : boolean = await update_cur_page(user_id, book_ISBN, end_page);

  // check if the state needs to be updated to completed
  if (end_page === last_page) {
     const update_book_satus : boolean = await update_book_status(user_id, book_ISBN, BookStatusStr.Completed);
     if (!update_book_satus) {
      interaction.reply(wrap_str_in_code_block("Issue updating book status to completed."));
      return;
     }
  }

  // add the log update the to log_progress table
  const logs_updated : boolean = await log_book_progress(user_id, book_ISBN, start_page, end_page);

  if (logs_updated) {
    interaction.reply(
      wrap_str_in_code_block(
        `Successfully logged progress.`
      )
    );
  } else {
    interaction.reply(
      wrap_str_in_code_block(
        `Issue updating proggess logs.`
      )
    );
  }

}

export async function get_pages_read_in_book(interaction : StringSelectMenuInteraction, book_isbn : string) {
  const modal = new ModalBuilder()
  .setCustomId(`${ModalType.LoggingPageInput}|${book_isbn}`) 
  .setTitle("How many pages did you read?")  
  .addComponents(
    // get components
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId("pages_read")
        .setLabel("Pages Read")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    )
  );
  
  await interaction.showModal(modal);
  
}

export const log_progress_command : Command = {
  command : CommandStringType.LOG_PROGRESS,
  command_type : CommandType.LOG_PROGRESS,
  description : "Logs the progress in a book you are reading.",
  action : execute_log_progress,
  requires_params : false
}