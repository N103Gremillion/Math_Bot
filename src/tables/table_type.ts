import { database_g } from "../entry";

export enum TABLE_TYPE {
  USERS, 
  INVALID
}

function get_table_string(table_type : TABLE_TYPE) : string {
  if (table_type == TABLE_TYPE.USERS) {
    return "users";
  } 
  else {
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

export async function view_table(table_type : TABLE_TYPE) : Promise<void> {
  
  const table_string : string = get_table_string(table_type);
  const query_string : string = "SELECT * FROM " + table_string + ";";
  
  if (table_string === "invalid"){
    console.log("Invalid Table Type.");
    return 
  }

  try {
    const rows = await get_rows(query_string);
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

export async function get_rows(sql_query: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    database_g.all(sql_query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}