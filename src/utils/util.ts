import { database_g } from "../entry"

export function wrap_str_in_code_block(str: string): string {
    return `\`\`\`\n${str}\n\`\`\``
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