import { get_rows, run_query } from "./table_type";

export type UserInfo = {
  id? : number,
  user_name? : string
}

export async function check_user_registered(user_name : string) : Promise<boolean> {
  try {
    const result : any[] = await get_rows(
      `
      SELECT user_name 
      FROM users
      WHERE user_name = ?;
      `
      ,[user_name]
    );
    return result.length > 0;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function insert_users_table(user_name : string) : Promise<boolean> {
  try {
    await run_query(
      `
      INSERT OR IGNORE INTO users(user_name) VALUES(?);
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

export async function fetch_all_users(): Promise<UserInfo[]> {
  return await get_rows(`SELECT * FROM users;`, []);
}

export async function fetch_user_id(user_name : string) : Promise<number> {
  try {
    const user_ids : UserInfo[] = await get_rows(
      `
      SELECT id 
      FROM users
      WHERE user_name = ?;
      `
      ,[user_name]
    );
    if (!user_ids || user_ids.length === 0 || !user_ids[0] || !user_ids[0].id) {
      return -1;
    }
    return user_ids[0].id;
  } catch (err) {
    console.log(`Issue fetching user_id for user_name: {user_name}`, err);
    return -1;
  }
}


