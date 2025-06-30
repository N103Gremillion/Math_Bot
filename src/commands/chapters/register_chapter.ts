import { Interaction, ModalSubmitInteraction, StringSelectMenuInteraction } from 'discord.js';
import { Command, COMMAND_TYPE } from './../command_types';
import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { select_book_menu } from '../selection_menus';
import { ModalType } from '../modals';
import { ChapterField } from './ChapterField';
import { wrap_str_in_code_block } from '../../utils/util';
import { fetch_page_count, fetch_total_chapters } from '../../tables/books';
import { insert_chapters_table } from '../../tables/chapters';

export async function execute_register_chapter(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_menu(cmd);
}

export async function handle_chapter_info_submission(
  book_id : number, 
  chapter_name : string, 
  chapter_number_str : string, 
  start_page_str : string, 
  end_page_str : string,
  interaction : ModalSubmitInteraction
) : Promise<void> {
  // handle checking for valid input 
  const chapter_number : number = Number(chapter_number_str);
  const start_page : number = Number(start_page_str);
  const end_page : number = Number(end_page_str);

  // null checks
  if (isNaN(chapter_number) || isNaN(start_page) || isNaN(end_page)) {
    await interaction.reply(
      wrap_str_in_code_block(
      `
      Invalid input expected a integer but was given a string for either chapter_number, start_page, or end_page.
      `
      )
    );
    return 
  }

  // query the total chapters
  const total_book_chapters : number = await fetch_total_chapters(book_id);

  // check for invalid chapter number values
  if (total_book_chapters === -1) {
    await interaction.reply(
      wrap_str_in_code_block(
      `
      Issue fetching from books table.
      Invalid book_id.`
      )
    );
    return 
  }
  else if (chapter_number > total_book_chapters || chapter_number < 1) {
    await interaction.reply(
      wrap_str_in_code_block(
      `
      Invalid chapter number either it is to big or to small.
      Note: use /view_book to select a book and its info`
      )
    );
    return 
  }

  // query page information
  const page_count : number = await fetch_page_count(book_id);
  
  if (page_count === -1) {
    await interaction.reply(
      wrap_str_in_code_block(
      `
      Issue fetching from books table.
      Invalid book_id.`
      )
    );
    return 
  }
  else if (start_page > page_count || end_page > page_count || start_page < 0 || end_page < 0 || end_page < start_page) {
    interaction.reply(
      wrap_str_in_code_block(
      `
      Invalid end_page or start_page.
      Note: use /view_book_info to select a book and its info`
      )
    );
    return 
  }

  const insert_successful : boolean = await insert_chapters_table(book_id, chapter_name, chapter_number, start_page, end_page);

  if (!insert_successful) {
    await interaction.reply(
      wrap_str_in_code_block(
        `
        Insertion unseccessful
        `)
    );
  } else {
    await interaction.reply(
      wrap_str_in_code_block(`Insertion seccessful`)
    );
  }

}

export async function get_chapter_info(interaction : StringSelectMenuInteraction, book_selected : string) : Promise<void> {

  const modal = new ModalBuilder()
  .setCustomId(`${ModalType.ChapterInput}|${book_selected}`)
  .setTitle("Enter Chapter Details")
  .addComponents(
    // get components
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(ChapterField.ChapterName)
        .setLabel("Chapter Name")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(ChapterField.ChapterNumber)
        .setLabel("Chapter Number")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(ChapterField.StartPage)
        .setLabel("Start Page")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(ChapterField.EndPage)
        .setLabel("End Page")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    )
  );

  await interaction.showModal(modal);
}

export const register_chapter_command : Command = {
  command : "register_chapter",
  command_type : COMMAND_TYPE.REGISTER_CHAPTER,
  description : "register a chapter in one of the books in the database",
  action : execute_register_chapter,
  requires_params : true
}
