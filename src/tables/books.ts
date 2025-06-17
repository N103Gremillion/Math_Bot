import { run } from "node:test";
import { run_query } from "./table_type";

export async function insert_books_table(title : string, author : string, pages : number, chapters : number, description : string) : Promise<boolean> {
  
  try {
    run_query(
      `
      `,
      [title, author, pages, chapters, description]
    );
    return true;
  } catch (err) {
    return false;
  }

}