import { BookField } from "../commands/books/BookField";
import { get_rows, run_query } from "./table_type";

export type BookInfo = {
  id?: number; // optional if not fetched
  title : string;
  author : string;
  page_count? : number;
  chapters? : number;
  description? : string;
}

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

// removals ----------------------------------
export async function remove_book_from_database(bookID : number) : Promise<boolean> {
  try {
    await run_query(
      `
      DELETE FROM books 
      WHERE id = ?;
      `, 
      [bookID]
    );
    return true;
  } catch (err) {
    console.log(`Issue removing book from database `, err);
    return false;
  }
}

// fetches -----------------------------------
export async function fetch_book_info(book_id : number) : Promise<BookInfo | null> {
  try {
    const rows : BookInfo[] = await get_rows(
      `
      SELECT title, author, page_count, chapters, description 
      FROM books 
      WHERE id = ?;
      `,
      [book_id]
    );
    if (rows.length === 0 || rows === undefined || rows[0] === undefined) {
      return null;
    }
    return rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function fetch_books_and_authors() : Promise<BookInfo[]> {
  try {
    const rows : BookInfo[] = await get_rows(
      `
      SELECT title, author, id 
      FROM books;
      `
    );
    return rows;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function fetch_total_chapters(book_id : number) : Promise<number> {
  try {
    const res = await get_rows(
      `
      SELECT chapters 
      FROM books 
      WHERE id = ?; 
      `,
      [book_id]
    );

    if (res.length === 0 || res[0].chapters == null) {
      return -1;
    }
    return res[0].chapters;

  } catch (err) {
    console.log(err);
    return -1;
  }
}

export async function fetch_page_count(book_id : number) : Promise<number> {
  try {
    const res = await get_rows(
      `
      SELECT page_count 
      FROM books 
      WHERE id = ?;
      `,
      [book_id]
    );

    if (res.length === 0 || res[0].page_count == null) {
      return -1;
    }
    
    return res[0].page_count;

  } catch (err) {
    console.log(err);
    return -1;
  }
}