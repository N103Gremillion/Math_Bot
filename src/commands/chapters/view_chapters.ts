import { ChatInputCommandInteraction, SlashCommandBuilder, StringSelectMenuInteraction } from "discord.js";
import { Command, CommandStringType, CommandType, default_command_builder } from "../command_types";
import { select_book_menu } from "../selection_menus";
import { ChapterInfo, fetch_chapters_in_book } from "../../tables/chapters";
import { BookInfo, fetch_book_and_author_info, fetch_total_chapters } from '../../tables/books';
import { wrap_str_in_code_block } from '../../utils/util';

export const view_chapters_command : Command = {
  command : CommandStringType.VIEW_CHAPTERS,
  command_type : CommandType.VIEW_CHAPTERS,
  description : "view all chapters in a book",
  action : execute_view_chapters, 
  command_builder : view_chapters_command_builder
}

export function view_chapters_command_builder(cmd : Command) : SlashCommandBuilder {
  return default_command_builder(cmd);
}

export async function execute_view_chapters(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_menu(cmd);
} 

export async function show_chapters_in_book(
  interaction: StringSelectMenuInteraction,
  book_isbn: string
): Promise<void> {
  const book : BookInfo | null = await fetch_book_and_author_info(book_isbn);

  if (!book) {
    await interaction.reply(wrap_str_in_code_block(`Issue fetching book info with ISBN: ${book_isbn}`));
  }

  const chapters: ChapterInfo[] = await fetch_chapters_in_book(book_isbn);
  const total_chapters: number = await fetch_total_chapters(book_isbn);
  let response_string = '';
  let chapters_index = 0;

  for (let i = 0; i < total_chapters; i++) {
    let cur_chapter_info = '';

    if (chapters_index >= chapters.length) {
      cur_chapter_info += 
          `\n=== Chapter ${i + 1}: Unknown Title ===\n` +
          `Start Page : Unknown\n` +
          `End Page   : Unknown\n` +
          `Sections   : Unknown\n`;
      ;
      response_string += cur_chapter_info;
      continue;
    }

    const chapter: ChapterInfo = chapters[chapters_index]!;
    const { 
      chapter_name, 
      chapter_number, 
      sections, 
      start_page, 
      end_page 
    } = chapter;

    if (i + 1 === chapter_number) {
      cur_chapter_info += 
        `\n=== Chapter ${chapter_number}: ${chapter_name} ===\n` +
        `Start Page : ${start_page}\n` +
        `End Page   : ${end_page}\n` +
        `Sections   : ${sections}\n`;
      chapters_index++;
    } else {
      cur_chapter_info += 
        `\n=== Chapter ${i + 1}: Unknown Title ===\n` +
        `Start Page : Unknown\n` +
        `End Page   : Unknown\n` +
        `Sections   : Unknown\n`;
    }

    response_string += cur_chapter_info;
  }

  await interaction.reply(
    wrap_str_in_code_block(response_string)
  );
    
}


