import { LOGS_PER_PAGE } from '../commands/progress_logs/view_logs';
import { get_rows, run_query } from "./table_type";

export type ProgressLogsInfo = {
  id? : number,
  user_id? : number,
  book_isbn? : string,
  start_page? : number,
  end_page? : number,
  timestamp? : string | Date
}

export async function log_book_progress(
  user_id : number,
  book_isbn : string,
  start_page : number,
  end_page : number,
) : Promise<boolean> {
  try {
    await run_query(
      `
      INSERT INTO progress_logs (user_id, book_isbn, start_page, end_page)
      VALUES (?, ?, ?, ?);
      ` 
      , [user_id, book_isbn, start_page, end_page]
    );
    return true; 
  } catch (err) {
    console.log(`Issue logging progress for:
user_id : ${user_id}, book_isbn : ${book_isbn}, start_page : ${start_page}, end_page : ${end_page}.`)
    return false;
  }
}

export async function fetch_logs_count_for_book(
  book_isbn : string,
  user_id : number
) : Promise<number> {
  try {
    const rows = await get_rows(
      `
      SELECT COUNT(*) AS count
      FROM progress_logs
      WHERE user_id = ? AND book_isbn = ?;
      `,
      [user_id, book_isbn]
    );
    
    if (!rows || rows.length === 0 || !rows[0]) {
      return -1;
    }

    return rows[0].count;
  } catch (err) {
    console.log(`issue fetching logs count for:
book_isbn : ${book_isbn}, user_id : ${user_id}`);
    return -1;
  }
}

export async function fetch_all_book_logs(
  user_id : number,
  book_isbn : string
) : Promise<ProgressLogsInfo[]> {
  try {
    const rows : ProgressLogsInfo[] = await get_rows(
      `
      SELECT start_page, end_page, timestamp
      FROM progress_logs
      WHERE user_id = ? AND book_isbn = ?
      ORDER BY timestamp ASC;
      `,
      [user_id, book_isbn]
    );

    return rows;
  } catch (err) {
    console.log(`Issue feching all logs for:
user_id : ${user_id}, book_isbn : ${book_isbn}`);
    return [];
  }
}

export async function fetch_page_of_logs(
  user_id : number,
  book_isbn : string,
  page : number
) : Promise<ProgressLogsInfo[]> {
  try {
    const offset : number = Math.max(0, (page - 1)) * LOGS_PER_PAGE;

    const rows : ProgressLogsInfo[] = await get_rows(
      `
      SELECT start_page, end_page, timestamp
      FROM progress_logs
      WHERE user_id = ? AND book_isbn = ?
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?;
      `,
      [user_id, book_isbn, LOGS_PER_PAGE, offset]
    );

    return rows;
  } catch (err) {
    console.log(`Issue fetching page of logs for:
user_id : ${user_id}, book_isbn : ${book_isbn}, page : ${page}`, err);
    return [];
  }
}