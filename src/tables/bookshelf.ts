import { get_rows, run_query } from "./table_type";

export type BookshelfInfo = {
  user_id : number;
  book_isbn : string;
  is_reading? : boolean;
  cur_page? : number;
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

export async function fetch_is_reading_book_state(user_id : number, book_isbn : string) : Promise<boolean> {
  try {
    const books : BookshelfInfo[] = await get_rows(
      `
      SELECT is_reading
      FROM bookshelf
      WHERE user_id = ? AND book_isbn = ?;
      `,
      [user_id, book_isbn]
    );

    if (!books || books.length === 0 || !books[0] || !books[0].is_reading) {
      console.log(`No book matches this isbn : ${book_isbn}, user_id : ${user_id}.
When fetching is_reading state.`);
      return false;
    }
    return Boolean(books[0]?.is_reading);
  } catch (err) {
    console.log(`Issue fetching for isbn : ${book_isbn}, user_id : ${user_id}.
When fetching is_reading state.`, err);
    return false;
  }
}

export async function fetch_bookshelf_state(user_id : number) : Promise<BookshelfInfo[]> {
  try {
    const books : BookshelfInfo[] = await get_rows(
      `
      SELECT book_isbn, is_reading, cur_page
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

export async function update_reading_state(
  user_id : number, 
  book_isbn : string
) : Promise<boolean> {
  try {
    await run_query(
      `
      UPDATE bookshelf
      SET is_reading = TRUE
      WHERE user_id = ? AND book_isbn = ?;
      `
      ,[user_id, book_isbn]
    );
    return true;
  } catch(err) {
    console.log("Issue updating reading state in bookshelf.", err);
    return false;
  }
} 