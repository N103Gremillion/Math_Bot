import { ModalSubmitInteraction } from "discord.js";
import { ChapterField } from "./chapters/ChapterField";
import { handle_chapter_info_modal_submission } from "./chapters/register_chapter";

export enum ModalType {
  ChapterInput = "chapter_input_modal",
  SectionInput = "section_input_modal",
}

export async function handleModalSubmit(interaction : ModalSubmitInteraction) : Promise<void> {

  const submission_info : string[] = interaction.customId.split("|");

  if (submission_info.length < 2 || submission_info[0] === undefined || submission_info[1] === undefined) {
    await interaction.reply({ content: "Missing necessary data in modal.", ephemeral: true });
    return;
  }

  const event_type : string = submission_info[0];
  const book_ID : number = parseInt(submission_info[1], 10);

  if (event_type === ModalType.ChapterInput) {
    // pull out the type of modal submit and 
    const chapter_name : string = interaction.fields.getTextInputValue(ChapterField.ChapterName);
    const chapter_number : string = interaction.fields.getTextInputValue(ChapterField.ChapterNumber);
    const total_sections :string = interaction.fields.getTextInputValue(ChapterField.Sections);
    const start_page : string = interaction.fields.getTextInputValue(ChapterField.StartPage);
    const end_page : string = interaction.fields.getTextInputValue(ChapterField.EndPage);
    await handle_chapter_info_modal_submission(book_ID, chapter_name, chapter_number, total_sections, start_page, end_page, interaction);
  }
}