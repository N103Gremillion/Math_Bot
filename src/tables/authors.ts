import { get_rows, run_query } from "./table_type";

// fetch all authors where the isbn of the book is isbn
export async function fetch_authors_with_isbn(isbn : string) : Promise<string[]> {
  try {
    
    const rows = await get_rows(
      `
      SELECT author
      FROM authors 
      WHERE isbn = ?;
      `,
      [isbn]
    );
    if (!rows || rows.length === 0) {
      return [];
    }
    return rows.map((row: {author: string}) => row.author);
  } catch (err) {
    console.log("Issue fetching authors from authors table.", err); 
    return [];
  }
}

export async function insert_authors_table(
  isbn : string, 
  authors : string[])
  : Promise<boolean> {
  
  try {
    // add each author to author table
    for (let i = 0; i < authors.length; i++) {
      const author : string | undefined = authors[i];
      if (!author || author === "Unknown Author" || author === "Unknown Authors") continue;
      await run_query(
        `
        INSERT OR IGNORE INTO authors(isbn, author)
        VALUES(?, ?);
        `,
        [isbn, author]
      );
    }
    return true;
  } catch (err) {
    console.log("Issue inserting into authors table.", err);
    return false; 
  }
}