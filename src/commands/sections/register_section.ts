import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, ModalSubmitInteraction, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command, COMMAND_TYPE } from "../command_types";
import { select_book_menu } from "../selection_menus";
import { ModalType } from "../modals";
import { ChapterField } from "../chapters/ChapterField";
import { SectionField } from "./SectionField";
import { wrap_str_in_code_block } from "../../utils/util";
import { fetch_chapter_end_page, fetch_chapter_start_page, fetch_total_sections_in_chapter } from "../../tables/chapters";
import { insert_sections_table } from "../../tables/sections";

export async function execute_register_section(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_menu(cmd);
}

export async function handle_section_info_modal_submission(
  book_id : number, 
  chapter_number : number, 
  section_number_str : string, 
  section_name : string,
  start_page_str : string, 
  end_page_str : string,
  total_questions_str : string,
  interaction : ModalSubmitInteraction
) : Promise<void> {

  // handle checking for valid input 
  const section_number : number = Number(section_number_str);
  const start_page : number = Number(start_page_str);
  const end_page : number = Number(end_page_str);
  const total_questions : number = Number(total_questions_str);

  // null checks
  if (isNaN(section_number) || isNaN(start_page) || isNaN(end_page) || isNaN(total_questions)) {
    await interaction.reply(
      wrap_str_in_code_block(
      `Invalid input expected a integer but was given a string for either chapter_number, start_page, or end_page.`
      )
    );
    return; 
  }

  // limit input for the total questions
  if (total_questions < 0 || total_questions > 10000) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Total questions is invalid. 
It is either to large or to small.` 
      )
    );
    return;
  }

  const total_sections_in_chapter : number = await fetch_total_sections_in_chapter(book_id, chapter_number);

  // check for valid section info
  if (total_sections_in_chapter === -1) {
    await interaction.reply(
      wrap_str_in_code_block(
      `Issue fetching from chapters table.`
      )
    );
    return;
  }
  else if (section_number > total_sections_in_chapter || section_number < 1) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Section number is Invalid.
It is either to large or to small.` 
      )
    );
    return;
  }

  // query page information
  const chapter_start_page : number = await fetch_chapter_start_page(book_id, chapter_number);
  const chapter_end_page : number = await fetch_chapter_end_page(book_id, chapter_number);

  if (start_page > end_page) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Start page cannot be greater than end page.`
      )
    );
    return;
  }
  
  if (start_page < chapter_start_page || start_page > chapter_end_page) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Section start_page is invalid.
It is either to large or to small.` 
      )
    );
    return;
  }

  if (end_page > chapter_end_page || end_page < chapter_start_page) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Section end_page is invalid.
It is either to large or to small.` 
      )
    );
    return;
  }

  const insert_successful : boolean = await insert_sections_table(book_id, chapter_number, section_number, section_name, start_page, end_page, total_questions);

  if (!insert_successful) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Insertion issue.`
      )
    );
  } else {
    await interaction.reply(
      wrap_str_in_code_block(`Insertion successful.`)
    );
  }

}

export async function get_section_info(interaction : StringSelectMenuInteraction, book_ID : number, chapter_number : number) : Promise<void> {
 
  const modal = new ModalBuilder()
  .setCustomId(`${ModalType.SectionInput}|${book_ID}|${chapter_number}`)
  .setTitle("Enter Section Details")
  .addComponents(
    // get components
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(SectionField.SectionNumber)
        .setLabel("section number")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(SectionField.SectionName)
        .setLabel("section name")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(SectionField.StartPage)
        .setLabel("start page")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(SectionField.EndPage)
        .setLabel("end page")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(SectionField.Questions)
        .setLabel("total question in section")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    )
  );

  await interaction.showModal(modal);

}

export const register_section_command : Command = {
  command: "register_section",
  command_type: COMMAND_TYPE.REGISTER_SECTION,
  description: "register a section in a book to the database",
  action: execute_register_section,
  requires_params : false
}