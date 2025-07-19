import { run_query } from "./table_type";

export type ProgressLogsInfo = {
  id? : number,
  user_id? : number,
  book_isbn? : string,
  start_page? : number,
  end_page? : number,
  timestamp? : string
}

export async function log_book_progress(
  user_id : number,
  book_isbn : string,
  start_page : number,
  end_page : number,
) : Promise<boolean> {
  try {
    await run_query(
      ``
      , [user_id, book_isbn, start_page, end_page]
    );
    return true;
  } catch (err) {
    console.log(`Issue logging progress for:
user_id : ${user_id}, book_isbn : ${book_isbn}, start_page : ${start_page}, end_page : ${end_page}.`)
    return false;
  }
}