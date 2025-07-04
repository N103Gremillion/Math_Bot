import { get_rows, run_query } from "./table_type";

export type SectionInfo = {
  book_id? : number,
  chapter_number? : number,
  section_number? : number,
  section_name? : string,
  start_page? : number,
  end_page? : number,
  total_questions : number
}

export async function insert_sections_table(
  book_ID : number, 
  chapter_number : number,
  section_number : number,
  section_name : string,
  start_page : number,
  end_page : number,
  total_questions : number 
) : Promise<boolean> {
  try {
    await run_query( 
      `
      INSERT  INTO sections(book_id, chapter_number, section_number, section_name, start_page, end_page, total_questions)
      VALUES(?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(book_id, chapter_number, section_number) DO UPDATE SET
      section_name = excluded.section_name,
      start_page = excluded.start_page,
      end_page = excluded.end_page,
      total_questions = excluded.total_questions;
      `,
      [book_ID, chapter_number, section_number, section_name, start_page, end_page, total_questions]
    );
    return true;
  } catch (err) {
    console.log(err);
    return false; 
  }
}