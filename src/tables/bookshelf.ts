import { get_rows, run_query } from "./table_type";

export enum BookStatusStr {
  Pending = 'pending',
  Reading = 'reading',
  Completed = 'completed',
}

export type BookStatus = `pending` | 'reading' | 'completed';

export type BookshelfInfo = {
  user_id : number;
  book_isbn : string;
  status? : BookStatus;
  cur_page? : number;
}

export async function fetch_cur_page_in_book(
  user_id : number,
  book_isbn : string 
) : Promise<number> {
  try {
    const rows : BookshelfInfo[] = await get_rows(
      `
      SELECT cur_page 
      FROM bookshelf
      WHERE user_id = ? AND book_isbn = ?;
      `, 
      [user_id, book_isbn]
    );
    if (!rows || rows.length === 0 || !rows[0] || !rows[0].cur_page) {
      console.log(`no match for cur_page for:
user_id : ${user_id}, book_isbn : ${book_isbn}`);
      return -1;
    }
    return rows[0].cur_page;
  } catch (err) {
    console.log(`Issue fetching cur page for:
user_id : ${user_id}, book_isbn : ${book_isbn}`)
    return -1;
  }
}

export async function fetch_books_users_reading(user_id : number) : Promise<BookshelfInfo[]> {
  try {
    const books : BookshelfInfo[] = await get_rows(
      `
      SELECT book_isbn
      FROM bookshelf
      WHERE user_id = ? AND status = ?;
      `, 
      [user_id, BookStatusStr.Reading]
    );
    if (!books) {
      console.log("books are undefined");
      return [];
    }
    return books;
  } catch (err){
    console.log("Issue fetching books user is reading.", err);
    return [];
  }
}

export async function fetch_total_books_in_bookshelf(user_id: number): Promise<number> {
  try {
    const total: { count: number }[] = await get_rows(
      `
      SELECT COUNT(*) AS count
      FROM bookshelf
      WHERE user_id = ?;
      `, 
      [user_id]
    );

    if (!total || total.length === 0 || !total[0] || total[0].count === undefined) {
      return -1;
    }
    return total[0].count;
  } catch (err) { 
    console.log(`Error fetching total books for user_id: ${user_id}`, err);
    return -1;
  } 
}

export async function insert_into_bookshelf(user_id : number, book_isbn : string) : Promise<boolean> { 
  try {
    await run_query(
      `
      INSERT OR IGNORE INTO bookshelf (user_id, book_isbn)
      VALUES (?, ?); 
      `
      ,[user_id, book_isbn] 
    ); 
    return true;
  } catch (err){
    console.log("Issue inserting into bookshelf.", err)
    return false;
  }
}

export async function is_book_in_bookshelf(user_id : number, book_isbn : string) : Promise<boolean> { 
  try {
    const result: any[] = await get_rows( 
      `
      SELECT 1
      FROM bookshelf
      WHERE user_id = ? AND book_isbn = ? 
      LIMIT 1;
      `,
      [user_id, book_isbn]
    );

    return result.length > 0;
  } catch (err) {
    console.log("Issue trying to see if book is in bookshelf.", err)
    return false;
  }
}

export async function fetch_book_status(user_id : number, book_isbn : string) : Promise<BookStatus> {
  try {
    const books : BookshelfInfo[] = await get_rows(
      `
      SELECT status
      FROM bookshelf
      WHERE user_id = ? AND book_isbn = ?;
      `,
      [user_id, book_isbn]
    );

    if (!books || books.length === 0 || !books[0] || !books[0].status) {
      console.log(`No book matches this isbn : ${book_isbn}, user_id : ${user_id}.
When fetching is_reading state.`);
      return BookStatusStr.Pending;
    }
    return books[0]?.status;
  } catch (err) {
    console.log(`Issue fetching for isbn : ${book_isbn}, user_id : ${user_id}.
When fetching is_reading state.`, err);
    return BookStatusStr.Pending;
  }
}

export async function fetch_bookshelf_state(user_id : number) : Promise<BookshelfInfo[]> {
  try {
    const books : BookshelfInfo[] = await get_rows(
      `
      SELECT book_isbn, status, cur_page
      FROM bookshelf
      WHERE user_id = ?;
      `,
      [user_id]
    );
    return books;
  } catch (err) {
    console.log(`issue fetching isbn's in bookshelf for user_id: ${user_id}`, err);
    return [];
  }
}

export async function remove_book_from_bookshelf(
  book_isbn : string, 
  user_id : number
) : Promise<boolean> {
  try {
    await run_query(
      `
      DELETE 
      FROM bookshelf
      WHERE book_isbn = ? AND user_id = ?;
      `,
      [book_isbn, user_id]
    );
    return true;
  } catch (err) {
    console.log(`Issue removing book from bookshelf.
user_id: ${user_id}, book_isbn: ${book_isbn}.`, err);
    return false;
  }
}

export async function clear_bookshelf(user_id : number) : Promise<boolean> {
  try {
    await run_query(
      `
      DELETE FROM bookshelf 
      WHERE user_id = ?;
      `,
      [user_id]
    );
    return true;
  } catch (err){
    console.log(`Issue clearing bookshelf for user_id: ${user_id}.`, err);
    return false;
  }
}

export async function update_cur_page(
  user_id : number, 
  book_isbn : string,
  cur_page : number
) : Promise<boolean> {
  try {
    await run_query(
      `
      UPDATE bookshelf
      SET cur_page = ?
      WHERE user_id = ? AND book_isbn = ?;
      `
      ,[cur_page, user_id, book_isbn]
    );
    return true;
  } catch(err) {
    console.log("Issue updating cur_page in bookshelf.", err);
    return false;
  }
} 

export async function update_book_status(
  user_id : number, 
  book_isbn : string,
  status : BookStatus
) : Promise<boolean> {
  try {
    await run_query(
      `
      UPDATE bookshelf
      SET status = ?
      WHERE user_id = ? AND book_isbn = ?;
      `
      ,[status, user_id, book_isbn]
    );
    return true;
  } catch(err) {
    console.log("Issue updating reading state in bookshelf.", err);
    return false;
  }
} 