import { get_rows, run_query } from "./table_type";
import { fetch_all_users, UserInfo } from "./users";

export type UserSkillpointsRaw = {
  skillpoints: number,
  user_id: number,
}

export type UserSkillpointsInfo = {
  user_id : number,
  skillpoints: number,
  user_name : string
}

export async function fetch_all_users_skillpoints_query() : Promise<UserSkillpointsInfo[]> {
  const rows: UserSkillpointsInfo[]  = await get_rows(
    `
      SELECT *
      FROM user_skillpoints
      JOIN users ON user_skillpoints.user_id = users.id;
    `,
    []
  );

  return rows;
}

export async function fetch_user_skillpoints_query(user_id: number) : Promise<number | undefined> {
  const rows: UserSkillpointsRaw[] = await get_rows(
    `
      SELECT * 
      FROM user_skillpoints 
      WHERE user_id = ?;
    `,
    [user_id]
  );

  console.log(rows);

  return rows[0]?.skillpoints;
}

export async function set_user_skillpoints_query(user_id: number, inc: number) : Promise<void> {
  await get_rows(
    `
      INSERT INTO user_skillpoints (user_id, skillpoints)
      VALUES (?, ?);
    `,
    [user_id, inc]
  );
}

export async function increment_user_skillpoints_query(user_id: number, inc: number) : Promise<void> {
  await get_rows(
    `
      UPDATE user_skillpoints 
      SET skillpoints = skillpoints + ?
      WHERE user_id = ?;
    `,
    [inc, user_id]
  );
}