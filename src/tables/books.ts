import { fetch_authors_with_isbn } from "./authors";
import { BookshelfInfo } from "./bookshelf";
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

// add total chapters info to a book
export async function add_total_chapters_to_book(isbn : string , total_chapters : number) : Promise<boolean> {
  try {
    // Check if any existing chapter exceeds the proposed total_chapters
    const rows = await get_rows(
      `
      SELECT chapter_number FROM chapters
      WHERE book_isbn = ? AND chapter_number > ?;
      `,
      [isbn, total_chapters]
    );

    if (rows.length > 0) {
      console.log(`Cannot reduce total_chapters to ${total_chapters}. Chapters exist beyond that.`);
      return false;
    }

    await run_query(
      `
      UPDATE books
      SET total_chapters = ?
      WHERE isbn = ?;
      `,
      [total_chapters, isbn]
    );
    
    return true;
  } catch (err) {
    console.log("Issue attaching total chapters to book.", err);
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
export async function fetch_books_with_isbns(books_isbns : BookshelfInfo[]) : Promise<BookInfo[]>{
  try {
    const res : BookInfo[] = [];

    for (const book of books_isbns) {

      const book_isbn : string | undefined = book?.book_isbn;
      if (!book_isbn) continue;

      const book_info : BookInfo | null = await fetch_book_and_author_info(book_isbn);
      if (book_info) res.push(book_info);
    }

    return res;
  } catch (err) {
    console.log(`Issue fetching books with isbns ${books_isbns}`, err);
    return [];
  }
}

export async function fetch_book_and_author_info(isbn : string) : Promise<BookInfo | null> {
  try {
    const rows : BookInfo[] = await get_rows(
      `
      SELECT isbn, title, number_of_pages, cover_id, total_chapters
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
      SELECT title, number_of_pages, cover_id, total_chapters
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

export async function fetch_books_and_authors_on_page(page_num : number, BOOKS_PER_PAGE : number) : Promise<BookInfo[]> {
  try {
    const offset : number = (page_num - 1) * BOOKS_PER_PAGE;

    // first get the books general in the index range
    const books : BookInfo[] = await get_rows(
      `
      SELECT isbn, title, number_of_pages, cover_id
      FROM books
      LIMIT ? OFFSET ?;
      `,
      [BOOKS_PER_PAGE, offset]
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
    console.log(`Issue fetching books on page ${page_num}`);
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

export async function fetch_total_chapters(isbn : string) : Promise<number> {
  try {
    const res = await get_rows(
      `
      SELECT total_chapters 
      FROM books 
      WHERE isbn = ?; 
      `,
      [isbn]
    );
    if (res.length === 0 || res[0].total_chapters == null) {
      return -1;
    }
    return res[0].total_chapters;

  } catch (err) {
    console.log(err);
    return -1;
  }
}

export async function fetch_page_count(book_isbn : string) : Promise<number> {
  try {
    const res = await get_rows(
      `
      SELECT number_of_pages 
      FROM books 
      WHERE isbn = ?;
      `,
      [book_isbn]
    );

    if (res.length === 0 || res[0].number_of_pages == null) {
      return -1;
    }
    
    return res[0].number_of_pages;

  } catch (err) {
    console.log(err);
    return -1;
  }
}

export async function fetch_book_count() : Promise<number> {
  try {
    const total = await get_rows(
      `
      SELECT COUNT (*) AS count
      FROM books;
      `,
      []
    );

    if (!total || total.length === 0 || !total[0]){
      console.log("Issue fetching book count ");
      return -1;
    }
    return total[0].count;

  } catch (err) {
    console.log("Issue fetching book count ", err);
    return -1;
  }
}