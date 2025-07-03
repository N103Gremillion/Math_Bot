import { get_rows, run_query } from "./table_type";

export type ChapterInfo = {
  book_id? : number,
  chapter_name : string,
  chapter_number : number,
  sections? : number,
  start_page? : number,
  end_page? : number
}

export async function insert_chapters_table(
  book_id : number, 
  chapter_name : string,  
  chapter_number : number,  
  total_sections : number,
  start_page : number, 
  end_page : number) : Promise<boolean> { 
    try {
      await run_query( 
        `
        INSERT OR REPLACE INTO chapters(book_id, chapter_name, chapter_number, sections, start_page, end_page)
        VALUES(?, ?, ?, ?, ?, ?);
        `,
        [book_id, chapter_name, chapter_number, total_sections, start_page, end_page]
      );
      return true;
    } catch (err) {
      console.log(err);
      return false; 
    }
}

export async function fetch_chapters_in_book(book_ID : number) : Promise<ChapterInfo[]> {
  try {
    const rows : ChapterInfo[] = await get_rows(
      `
      SELECT chapter_name, chapter_number 
      FROM chapters 
      WHERE book_id = ?
      ORDER BY chapter_number;
      `,
      [book_ID]
    );
    return rows;
  } catch (err) {
    console.log(err);
    return [];
  }
}