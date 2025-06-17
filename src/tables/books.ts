import { run_query } from "./table_type";

export async function insert_books_table(title : string, author : string, pages : number, chapters : number, description : string): Promise<boolean> {
  
  try {
    await run_query(
      `
      INSERT OR IGNORE INTO books(title, author, page_count, chapters, description)
      VALUES(?, ?, ?, ?, ?);
      `,
      [title, author, pages, chapters, description]
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }

}