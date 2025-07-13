import { get_rows, run_query } from "./table_type";

export type BookshelfInfo = {
  user_id : number;
  book_isbn : string;
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

export async function fetch_bookshelf_isbns(user_id : number) : Promise<BookshelfInfo[]> {
  try {
    const books : BookshelfInfo[] = await get_rows(
      `
      SELECT book_isbn
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