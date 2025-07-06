import { database_g } from "../entry";

export enum TABLE_TYPE {
  USERS, 
  BOOKS,
  READING,
  CHAPTERS,
  SECTIONS,
  PROGRESS_LOGS,
  INVALID
}

function get_table_string(table_type : TABLE_TYPE) : string {
  if (table_type == TABLE_TYPE.USERS) {
    return "users";
  } else if (table_type == TABLE_TYPE.READING) {
    return "reading";
  } else if (table_type == TABLE_TYPE.BOOKS) {
    return "books";
  } else if (table_type == TABLE_TYPE.CHAPTERS) {
    return "chapters";
  } else if (table_type == TABLE_TYPE.SECTIONS) {
    return "sections";
  } else if (table_type == TABLE_TYPE.PROGRESS_LOGS) {
    return "progress_logs";
  } else {
    return "invalid";
  }
}

export async function clear_table(table_type : TABLE_TYPE) : Promise<void> {

  const table_string : string = get_table_string(table_type);
  const query_string : string = "DELETE FROM " + table_string + ";";
  
  if (table_string === "invalid"){
    console.log("Invalid Table Type.");
    return 
  }

  try {
    await run_query( query_string, []);
  } catch (err) {
    console.log(`Error clearing ${table_string} table`, err);
  }

}

export async function drop_table(table_type: TABLE_TYPE): Promise<void> {
  const table_string = get_table_string(table_type);

  if (table_string === "invalid") {
    console.log("Invalid Table Type.");
    return;
  }

  const query_string = `DROP TABLE IF EXISTS ${table_string};`;

  try {
    await run_query(query_string, []);
    console.log(`Dropped table: ${table_string}`);
  } catch (err) {
    console.error(`Error dropping ${table_string} table:`, err);
  }
}


export async function view_table(table_type : TABLE_TYPE) : Promise<void> {
  
  const table_string : string = "\n" + get_table_string(table_type);
  const query_string : string = "SELECT * FROM " + table_string + ";";
  
  if (table_string === "invalid"){
    return 
  }

  try {
    const rows = await get_rows(query_string);
    console.log(table_string);
    console.table(rows);
    
  } catch (err) {
    console.log("Error viewing users table:", err);
  }
}

export async function run_query(sql_query : string, params : any[] = []) : Promise<void> {
  return new Promise ((resolve, reject) => {
      database_g.run(sql_query, params, function (err) {
          if (err) reject(err);
          else resolve();
      });
  });
}

export async function get_rows(sql_query: string, params : any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    database_g.all(sql_query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
