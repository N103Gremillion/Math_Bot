import { ChatInputCommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { Command, COMMAND_TYPE } from "../command_types";
import { select_book_menu } from "../selection_menus";
import { ChapterInfo, fetch_chapters_in_book } from "../../tables/chapters";
import { fetch_total_chapters } from '../../tables/books';
import { wrap_str_in_code_block } from '../../utils/util';


export async function execute_view_chapters(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_menu(cmd);
} 

export async function show_chapters_in_book(
  interaction: StringSelectMenuInteraction,
  book_ID: number
): Promise<void> {
  const chapters: ChapterInfo[] = await fetch_chapters_in_book(book_ID);
  const total_chapters: number = await fetch_total_chapters(book_ID);
  let response_string = '';
  let chapters_index = 0;

  for (let i = 0; i < total_chapters; i++) {
    let cur_chapter_info = '';

    if (chapters_index >= chapters.length) {
      cur_chapter_info += `Chapter ${i + 1} : Is not registered\n`;
      response_string += cur_chapter_info;
      continue;
    }

    const chapter: ChapterInfo = chapters[chapters_index]!;
    const { chapter_name, chapter_number } = chapter;

    if (i + 1 === chapter_number) {
      cur_chapter_info += `Chapter ${chapter_number} : ${chapter_name}\n`;
      chapters_index++;
    } else {
      cur_chapter_info += `Chapter ${i + 1} : Is not registered\n`;
    }

    response_string += cur_chapter_info;
  }

  await interaction.reply(wrap_str_in_code_block(response_string));
}


export const view_chapters_command : Command = {
  command : "view_chapters",
  command_type : COMMAND_TYPE.VIEW_CHAPTERS,
  description : "view all chapters in a book",
  action : execute_view_chapters, 
  requires_params : false
}