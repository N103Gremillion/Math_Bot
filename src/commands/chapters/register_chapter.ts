import { ModalSubmitInteraction, StringSelectMenuInteraction } from 'discord.js';
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

export async function handle_chapter_info_modal_submission(
  book_isbn : string, 
  chapter_name : string, 
  chapter_number_str : string, 
  total_sections_str : string,
  start_page_str : string, 
  end_page_str : string,
  interaction : ModalSubmitInteraction
) : Promise<void> {
  // handle checking for valid input 
  const chapter_number : number = Number(chapter_number_str);
  const start_page : number = Number(start_page_str);
  const end_page : number = Number(end_page_str);
  const total_sections : number = Number(total_sections_str);

  // null checks
  if (isNaN(chapter_number)) {
    await interaction.reply(
      wrap_str_in_code_block(
      `Invalid input expected a integer for chapter_number.`
      )
    );
    return; 
  } else if (isNaN(start_page)) {
    await interaction.reply(
      wrap_str_in_code_block(
      `Invalid input expected a integer for start_page.`
      )
    );
    return;
  } else if (isNaN(end_page)) {
    await interaction.reply(
      wrap_str_in_code_block(
      `Invalid input expected a integer for end_page.`
      )
    );
    return;
  } else if (isNaN(total_sections)) {
    await interaction.reply(
      wrap_str_in_code_block(
      `Invalid input expected a integer for total_sections.`
      )
    );
    return;
  }

  // check if sections make sense
  if (total_sections <= 0) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Total sections is to small it must be > 0.` 
      )
    );
    return;
  } else if (total_sections > 10000) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Total sections is to large it must be < 10000.` 
      )
    );
    return;
  }

  // query the total chapters
  const total_book_chapters : number = await fetch_total_chapters(book_id);

  // check for invalid chapter number values
  if (total_book_chapters === -1) {
    await interaction.reply(
      wrap_str_in_code_block(
      `Issue fetching from books table.
Invalid book_id.`
      )
    );
    return;
  }
  else if (chapter_number < 1) {
    await interaction.reply(
      wrap_str_in_code_block(
      `Chapter number is to small it must be > 0`
      )
    );
    return; 
  }
  else if (chapter_number > total_book_chapters) {
    await interaction.reply(
      wrap_str_in_code_block(
      `Chapter number is to large this book has a max of ${total_book_chapters} chapters.`
      )
    );
    return;
  }

  // query page information
  const page_count : number = await fetch_page_count(book_id);
  
  if (page_count === -1) {
    await interaction.reply(
      wrap_str_in_code_block(
      `Issue fetching from books table.
Invalid book_id.`
      )
    );
    return; 
  }
  else if (start_page < 0) {
    interaction.reply(
      wrap_str_in_code_block(
      `Start page can not be less than 0`
      )
    );
    return; 
  } else if (end_page < 0) {
    interaction.reply(
      wrap_str_in_code_block(
      `End page can not be less than 0`
      )
    );
    return; 
  } else if (start_page > page_count) {
    interaction.reply(
      wrap_str_in_code_block(
      `Start page can not be greater than total pages in book, this book has a total of ${page_count} pages.`
      )
    );
    return; 
  } else if (end_page > page_count) {
    interaction.reply(
      wrap_str_in_code_block(
      `End page can not be greater than total pages in book, this book has a total of ${page_count} pages.`
      )
    );
    return;
  } else if (end_page < start_page) {
    interaction.reply(
      wrap_str_in_code_block(
      `End page cannot be greater then end page. Input(start_page : ${start_page}, end_page : ${end_page})`
      )
    );
    return;
  }

  const insert_successful : boolean = await insert_chapters_table(book_isbn, chapter_name, chapter_number, total_sections, start_page, end_page);

  if (!insert_successful) {
    await interaction.reply(
      wrap_str_in_code_block(
        `====================== Insertion issue for =======================
Chapter name: ${chapter_name}
Chapter number: ${chapter_number}
Total sections: ${total_sections}
Start page: ${start_page}
End page: ${end_page}`
      )
    );
  } else {
    await interaction.reply(
      wrap_str_in_code_block(`=================== Insertion successful for =======================
Chapter name: ${chapter_name}
Chapter number: ${chapter_number}
Total sections: ${total_sections}
Start page: ${start_page}
End page: ${end_page}`)
    );
  }

}

export async function get_chapter_info(interaction : StringSelectMenuInteraction, book_ISBN : string) : Promise<void> {
  
  const modal = new ModalBuilder()
  .setCustomId(`${ModalType.ChapterInput}|${book_ISBN}`)
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
        .setCustomId(ChapterField.Sections)
        .setLabel("Total Number of Sections")
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
