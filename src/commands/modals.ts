import { ModalSubmitInteraction } from "discord.js";
import { ChapterField } from "./chapters/ChapterField";
import { handle_chapter_info_modal_submission } from "./chapters/register_chapter";
import { SectionField } from "./sections/SectionField";
import { handle_section_info_modal_submission } from "./sections/register_section";
import { BookField } from "./books/BookField";
import { handle_total_chapters_modal_submission } from "./books/register_total_chapters";
import { BookshelfField } from "./bookshelf/BookshelfField";
import { handle_start_page_modal_submission } from "./bookshelf/start_reading";
import { handle_logging_page_input_submission } from "./progress_logs/log_progress";

export enum ModalType {
  ChapterInput = "chapter_input_modal",
  SectionInput = "section_input_modal",
  TotalChaptersInput = "total_chapters_input_modal",
  StartingPageInput = "starting_page_input_modal",
  LoggingPageInput = "logging_page_input_modal",
}

export async function handleModalSubmit(interaction : ModalSubmitInteraction) : Promise<void> {

  const submission_info : string[] = interaction.customId.split("|");

  if (submission_info.length < 2 || submission_info[0] === undefined || submission_info[1] === undefined) {
    await interaction.reply({ content: "Missing necessary data in modal.", ephemeral: true });
    return;
  }

  const event_type : string = submission_info[0];
  const book_ISBN : string = submission_info[1];

  if (event_type === ModalType.ChapterInput) {
    // pull out the info from the modal
    const chapter_name : string = interaction.fields.getTextInputValue(ChapterField.ChapterName);
    const chapter_number : string = interaction.fields.getTextInputValue(ChapterField.ChapterNumber);
    const total_sections :string = interaction.fields.getTextInputValue(ChapterField.Sections);
    const start_page : string = interaction.fields.getTextInputValue(ChapterField.StartPage);
    const end_page : string = interaction.fields.getTextInputValue(ChapterField.EndPage);
    await handle_chapter_info_modal_submission(book_ISBN, chapter_name, chapter_number, total_sections, start_page, end_page, interaction);
  } 
  else if (event_type === ModalType.TotalChaptersInput) {
    // pull of total chapters
    const total_chapters_str : string = interaction.fields.getTextInputValue(BookField.TotalChapters);
    await handle_total_chapters_modal_submission(book_ISBN, total_chapters_str, interaction);
  } 
  else if (event_type === ModalType.SectionInput) {
    if (submission_info.length < 3 || submission_info[2] === undefined) {
      await interaction.reply({ content: "Missing necessary data in modal.", ephemeral: true });
      return;
    }
    // pull out info form modal
    const chapter_number : number = parseInt(submission_info[2], 10);
    const section_number : string = interaction.fields.getTextInputValue(SectionField.SectionNumber);
    const section_name : string = interaction.fields.getTextInputValue(SectionField.SectionName);
    const start_page : string = interaction.fields.getTextInputValue(SectionField.StartPage);
    const end_page : string = interaction.fields.getTextInputValue(SectionField.EndPage);
    const total_questions : string = interaction.fields.getTextInputValue(SectionField.Questions);
    await handle_section_info_modal_submission(book_ISBN, chapter_number, section_number, section_name, start_page, end_page, total_questions, interaction);
  }
  else if (event_type === ModalType.StartingPageInput) {
    const start_page_str : string = interaction.fields.getTextInputValue(BookshelfField.CurPage);
    const start_page : number = parseInt(start_page_str, 10);
    await handle_start_page_modal_submission(book_ISBN, start_page, interaction);
  }
  else if (event_type === ModalType.LoggingPageInput) {
    const pages_read_str : string = interaction.fields.getTextInputValue("pages_read");
    await handle_logging_page_input_submission(book_ISBN, pages_read_str, interaction);
  }
  else {
    await interaction.reply({ content: "Event type not available for this modal", ephemeral: true });
  }
}