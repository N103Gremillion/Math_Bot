import { run_query, get_rows } from "../utils/util";

export async function insert_users_table(user_name : string) : Promise<boolean> {
  try {
    await run_query(
      `
      INSERT INTO users(user_name) VALUES(?);
      `
      ,[user_name]
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function delete_users_table() : Promise<void> {

}

export async function clear_users_table() : Promise<void> {
  try {
    await run_query(
      `
      DELETE FROM users;
      `,[]
    );
  } catch (err) {
    console.log("Error clearing users table ", err);
  }
}

export async function view_users_table() : Promise<void> {
  try {
    const rows = await get_rows(
      `
      SELECT * FROM users;
      `
    );
    console.table(rows);
    
  } catch (err) {
    console.log("Error viewing users table:", err);
  }
}


