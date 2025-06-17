import { run_query } from "./table_type";

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

export async function remove_from_users_table(user_name : string) : Promise<boolean> {
  try {
    await run_query(
      `
      DELETE FROM users WHERE users.user_name = ?;
      `
      ,[user_name]
    );
    return true;
  } catch (err) {
    console.log("Issue deleting user: ", err);
    return false;
  }
}



