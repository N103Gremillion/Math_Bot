import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command, CommandType, CommandStringType, default_command_builder } from "../command_types";
import { select_book_menu } from "../selection_menus";
import { ModalType } from "../modals";
import { SectionField } from "./SectionField";
import { wrap_str_in_code_block } from "../../utils/util";
import { fetch_chapter_end_page, fetch_chapter_start_page, fetch_total_sections_in_chapter } from "../../tables/chapters";
import { insert_sections_table } from "../../tables/sections";

export const register_section_command : Command = {
  command: CommandStringType.REGISTER_SECTION,
  command_type: CommandType.REGISTER_SECTION,
  description: "register a section in a book to the database",
  action: execute_register_section,
  command_builder : register_section_command_builder
}

export function register_section_command_builder(cmd : Command) : SlashCommandBuilder {
  return default_command_builder(cmd);
}

export async function execute_register_section(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_menu(cmd);
}

export async function handle_section_info_modal_submission(
  book_isbn : string, 
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
  if (isNaN(section_number)) {
    await interaction.reply(
      wrap_str_in_code_block(
      `Invalid input expected a integer but was given a string for section_number.`
      )
    );
    return; 
  } else if (isNaN(start_page)){
    await interaction.reply(
      wrap_str_in_code_block(
      `Invalid input expected a integer but was given a string for start_page.`
      )
    );
    return;
  } else if (isNaN(end_page)) {
    await interaction.reply(
      wrap_str_in_code_block(
      `Invalid input expected a integer but was given a string for end_page.`
      )
    );
    return;
  } else if (isNaN(total_questions)) {
    await interaction.reply(
      wrap_str_in_code_block(
      `Invalid input expected a integer but was given a string for total_questions.`
      )
    );
    return;
  }

  // limit input for the total questions
  if (total_questions < 0) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Total questions is to small expected value >= 1.` 
      )
    );
    return;
  } else if (total_questions >= 1000) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Total questions is to large the limit is 1000`
      )
    );
    return;
  }

  const total_sections_in_chapter : number = await fetch_total_sections_in_chapter(book_isbn, chapter_number);

  // check for valid section info
  if (total_sections_in_chapter === -1) {
    await interaction.reply(
      wrap_str_in_code_block(
      `Error fetching total sections in chapter.`
      )
    );
    return;
  }
  else if (section_number < 1) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Section number is to small the smallest possible section_number is 1.` 
      )
    );
    return;
  }
  else if (section_number > total_sections_in_chapter) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Section number is to large for this chapter this chapter has a total of ${total_sections_in_chapter} sections.` 
      )
    );
    return;
  }

  // query page information
  const chapter_start_page : number = await fetch_chapter_start_page(book_isbn, chapter_number);
  const chapter_end_page : number = await fetch_chapter_end_page(book_isbn, chapter_number);

  if (start_page > end_page) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Start page cannot be greater than end page | you put start_page: ${start_page}, end_page: ${end_page}.`
      )
    );
    return;
  }
  
  if (start_page < chapter_start_page) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Section start page is smaller than chapter start page.
chapter_start: ${chapter_start_page}, chapter_end: ${chapter_end_page}` 
      )
    );
    return;
  }
  else if (start_page > chapter_end_page) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Section start page is larger than chapter end page.
chapter_start: ${chapter_start_page}, chapter_end: ${chapter_end_page}` 
      )
    );
    return;
  }

  if (end_page < chapter_start_page) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Section end page is smaller than chapter start page.
chapter_start: ${chapter_start_page}, chapter_end: ${chapter_end_page}` 
      )
    );
    return;
  } 
  else if (end_page > chapter_end_page) {
    await interaction.reply(
      wrap_str_in_code_block(
        `Section end page is larger than chapter end page.
chapter_start: ${chapter_start_page}, chapter_end: ${chapter_end_page}` 
      )
    );
    return;
  }

  const insert_successful : boolean = await insert_sections_table(book_isbn, chapter_number, section_number, section_name, start_page, end_page, total_questions);

  if (!insert_successful) {
    await interaction.reply(
      wrap_str_in_code_block(
        `=========== Insertion issue for==============
Book ISBN: ${book_isbn}
Chapter Number: ${chapter_number}
Section Number: ${section_number}
Section Name: ${section_name}
Start Page: ${start_page}
End Page: ${end_page}
Total Questions: ${total_questions}`
      )
    );
  } else {
    await interaction.reply(
      wrap_str_in_code_block(`============= Insertion successful for =============
Book ISBN: ${book_isbn}
Chapter Number: ${chapter_number}
Section Number: ${section_number}
Section Name: ${section_name}
Start Page: ${start_page}
End Page: ${end_page}
Total Questions: ${total_questions}`  
      )
    );
  }

}

export async function get_section_info(interaction : StringSelectMenuInteraction, book_isbn: string, chapter_number : number) : Promise<void> {
  
  const modal = new ModalBuilder()
  .setCustomId(`${ModalType.SectionInput}|${book_isbn}|${chapter_number}`)
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

