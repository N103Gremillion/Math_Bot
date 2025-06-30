import { ModalSubmitInteraction } from "discord.js";
import { ChapterField } from "./chapters/ChapterField";
import { handle_chapter_info_submission } from "./chapters/register_chapter";

export enum ModalType {
  ChapterInput = "chapter_input_modal",
  SectionInput = "section_input_modal",
  View_Book_Infor = "",
}

export async function handleModalSubmit(interaction : ModalSubmitInteraction) : Promise<void> {

  const submissionInfo : string[] = interaction.customId.split("|");

  if (submissionInfo.length < 2 || submissionInfo[0] === undefined || submissionInfo[1] === undefined) {
    await interaction.reply({ content: "Missing necessary data in modal.", ephemeral: true });
    return;
  }

  const eventType : string = submissionInfo[0];
  const bookID : number = parseInt(submissionInfo[1], 10);

  if (eventType === ModalType.ChapterInput) {
    // pull out the type of modal submit and 
    const chapterName : string = interaction.fields.getTextInputValue(ChapterField.ChapterName);
    const chapterNumber : string = interaction.fields.getTextInputValue(ChapterField.ChapterNumber);
    const startPage : string = interaction.fields.getTextInputValue(ChapterField.StartPage);
    const endPage : string = interaction.fields.getTextInputValue(ChapterField.EndPage);
    await handle_chapter_info_submission(bookID, chapterName, chapterNumber, startPage, endPage, interaction);
  }
}