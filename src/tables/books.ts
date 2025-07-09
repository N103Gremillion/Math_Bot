import { BookField } from "../commands/books/BookField";
import { get_rows, run_query } from "./table_type";

export type BookInfo = {
  isbn? : string;
  title : string;
  author : string;
  number_of_pages : number;
  cover_id? : number | undefined;
  total_chapters? : number;
}

export async function insert_books_table(
  isbn : string, 
  title : string, 
  author : string, 
  total_pages : number, 
  cover_id : number | undefined)
  : Promise<boolean> {
  
  try {
    await run_query(
      `
      INSERT OR IGNORE INTO books(isbn, title, author, number_of_pages, cover_id)
      VALUES(?, ?, ?, ?, ?);
      `,
      [isbn, title, author, total_pages, cover_id]
    );
    return true;
  } catch (err) {
    console.log("Issue inserting into books table.", err);
    return false; 
  }
}

// removals ----------------------------------
export async function remove_book_from_database(isbn : string) : Promise<boolean> {
  try {
    await run_query(
      `
      DELETE FROM books 
      WHERE isbn = ?;
      `, 
      [isbn]
    );
    return true;
  } catch (err) {
    console.log(`Issue removing book from database `, err);
    return false;
  }
}

// fetches -----------------------------------
export async function fetch_book_info(isbn : string) : Promise<BookInfo | null> {
  try {
    const rows : BookInfo[] = await get_rows(
      `
      SELECT title, author, number_of_pages, cover_id, total_chapters
      FROM books 
      WHERE isbn = ?;
      `,
      [isbn]
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

export async function fetch_books_info() : Promise<BookInfo[]> {
  try {
    const rows : BookInfo[] = await get_rows(
      `
      SELECT isbn, title, author, number_of_pages, cover_id
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