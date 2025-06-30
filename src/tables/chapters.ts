import { run_query } from "./table_type";

export async function insert_chapters_table(
  book_id : number, 
  chapter_name : string, 
  chapter_number : number,  
  start_page : number, 
  end_page : number) : Promise<boolean> { 

    try {
      await run_query( 
        `
        INSERT OR REPLACE INTO chapters(book_id, chapter_name, chapter_number, start_page, end_page)
        VALUES(?, ?, ?, ?, ?);
        `,
        [book_id, chapter_name, chapter_number, start_page, end_page]
      );
      return true;
    } catch (err) {
      console.log(err);
      return false; 
    }

}