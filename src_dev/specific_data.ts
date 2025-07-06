import { BookInfo, fetch_books_info, insert_books_table } from "../src/tables/books";
import { insert_chapters_table } from "../src/tables/chapters";
import { insert_sections_table } from "../src/tables/sections";

export async function insert_How_To_Prove_It() : Promise<void> {
  // first input the book itself
  await insert_books_table("How To Prove It", "Daniel J. Velleman", );
  // next input chapter and section info

}