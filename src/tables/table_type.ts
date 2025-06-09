import { clear_users_table } from "./users"

export enum TABLE_TYPE {
  USERS
}

export async function clear_table(table_type : TABLE_TYPE) : Promise<void> {
  if (table_type == TABLE_TYPE.USERS) {
    clear_users_table();
  }
}