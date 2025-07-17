import { get_rows, run_query } from "./table_type";

export type ChapterInfo = {
  book_isbn? : string,
  chapter_name? : string,
  chapter_number? : number,
  sections? : number,
  start_page? : number,
  end_page? : number
}

export async function insert_chapters_table(
  book_isbn : string, 
  chapter_name : string,  
  chapter_number : number,  
  total_sections : number,
  start_page : number, 
  end_page : number) : Promise<boolean> { 
    try {
      await run_query( 
        `
        INSERT OR REPLACE INTO chapters(book_isbn, chapter_name, chapter_number, sections, start_page, end_page)
        VALUES(?, ?, ?, ?, ?, ?)
        ON CONFLICT(book_isbn, chapter_number) DO UPDATE SET
        chapter_name = excluded.chapter_name,
        sections = excluded.sections,
        start_page = excluded.start_page,
        end_page = excluded.end_page;
        `,
        [book_isbn, chapter_name, chapter_number, total_sections, start_page, end_page]
      );
      return true;
    } catch (err) {
      console.log(err);
      return false; 
    }
}

export async  function fetch_chapter_start_page(
  book_isbn : string, 
  chapter_number : number
) : Promise<number> {

  try {
    const start_page_list : ChapterInfo[] = await get_rows(
      `
      SELECT start_page 
      FROM chapters
      WHERE book_isbn = ? AND chapter_number = ?;
      `,
      [book_isbn, chapter_number]
    );
    
    if (start_page_list === undefined || start_page_list.length != 1 || start_page_list[0] === undefined || start_page_list[0].start_page === undefined){
      console.log("Issue fetching start_page in chapters");
      return -1;
    }

    return start_page_list[0]?.start_page;

  } catch (err) {
    console.log("Issue fetching start_page chapter ", err);
    return -1;
  }
}

export async  function fetch_chapter_end_page(
  book_isbn : string, 
  chapter_number : number
) : Promise<number> {
  try {
    const start_page_list : ChapterInfo[] = await get_rows(
      `
      SELECT end_page 
      FROM chapters
      WHERE book_isbn = ? AND chapter_number = ?;
      `,
      [book_isbn, chapter_number]
    );
    
    if (start_page_list === undefined || start_page_list.length != 1 || start_page_list[0] === undefined || start_page_list[0].end_page === undefined){
      console.log("Issue fetching end_page in chapters");
      return -1;
    }

    return start_page_list[0]?.end_page;

  } catch (err) {
    console.log("Issue fetching end_page in chapter ", err);
    return -1;
  }
}

export async function fetch_total_sections_in_chapter(
  book_isbn : string, 
  chapter_number : number) 
  : Promise<number> {

  try {
    const total_sections_list : ChapterInfo[] = await get_rows(
      `
      SELECT sections 
      FROM chapters
      WHERE book_isbn = ? AND chapter_number = ?;
      `,
      [book_isbn, chapter_number]
    );

    if (!total_sections_list || total_sections_list.length !== 1) {
      console.log("Invalid or duplicate results when fetching total sections in chapter");
      return -1;
    }

    const sectionCount : ChapterInfo | undefined = total_sections_list[0];
    
    if (!sectionCount || !sectionCount.sections) {
      console.log("Invalid or duplicate results when fetching total sections in chapter");
      return -1;
    }

    return sectionCount.sections;

  } catch (err) {
    console.log("Issue fetching total sections in chapter ", err);
    return -1;
  }
} 

export async function fetch_chapters_in_book(book_isbn : string) : Promise<ChapterInfo[]> {
  try {
    const rows : ChapterInfo[] = await get_rows(
      `
      SELECT chapter_name, chapter_number, sections, start_page, end_page
      FROM chapters 
      WHERE book_isbn = ?
      ORDER BY chapter_number;
      `,
      [book_isbn]
    );
    return rows;
  } catch (err) {
    console.log(err);
    return [];
  }
}