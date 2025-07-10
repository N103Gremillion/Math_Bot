import { fetch_authors_with_isbn } from "./authors";
import { get_rows, run_query } from "./table_type";

export type BookInfo = {
  isbn? : string;
  title : string;
  authors : string[];
  number_of_pages : number;
  cover_id? : number | undefined;
  total_chapters? : number;
}

export async function insert_books_table(
  isbn : string, 
  title : string, 
  total_pages : number, 
  cover_id : number | undefined)
  : Promise<boolean> {
  
  try {
    await run_query(
      `
      INSERT OR IGNORE INTO books(isbn, title, number_of_pages, cover_id) 
      VALUES(?, ?, ?, ?);
      `,
      [isbn, title, total_pages, cover_id]
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
export async function fetch_book_and_author_info(isbn : string) : Promise<BookInfo | null> {
  try {
    const rows : BookInfo[] = await get_rows(
      `
      SELECT title, number_of_pages, cover_id, total_chapters
      FROM books 
      WHERE isbn = ?;
      `,
      [isbn]
    );
    if (!rows || rows.length === 0 || !rows[0]) {
      return null;
    }
    const book : BookInfo = rows[0];
    book.authors  = await fetch_authors_with_isbn(isbn);
    return book;
  } catch (err) {
    console.log(`Issue fetching author and book info for ISBN: ${isbn}`, err);
    return null;
  }
}

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

export async function fetch_books_info(): Promise<BookInfo[]> {
  try {
    const books: BookInfo[] = await get_rows(
      `
      SELECT title, total_chapters
      FROM books;
      `
    );
    
    return books;
  } catch (err) {
    console.log("Issue fetching books and authors info", err);
    return [];
  }
}

export async function fetch_books_and_authors_info() : Promise<BookInfo[]> {
  try {
    // first get the books general info
    const books : BookInfo[] = await get_rows(
      `
      SELECT isbn, title, number_of_pages, cover_id
      FROM books;
      `
    );
    // attach authors info to the books
    await Promise.all(
      books.map(async (book) => {
        if (book.isbn) {
          book.authors = await fetch_authors_with_isbn(book.isbn);
        }
      })
    );
    return books;
  } catch (err) {
    console.log("Issue fetching books and authors info ", err);
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