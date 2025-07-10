import { run_query } from "./table_type";

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