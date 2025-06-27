import { get_rows, run_query } from "./table_type";

export type BookInfo = {
  title : string;
  author: string;
};

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

export async function fetch_books_and_authors() : Promise<BookInfo[]> {
  try {
    const rows : BookInfo[] = await get_rows(
      `
      SELECT title, author FROM books;
      `
    );
    return rows;
  } catch (err) {
    console.log(err);
    return [];
  }
}
