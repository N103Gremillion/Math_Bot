import path from "path";
import { config } from "../src_shared/config";
import fs from 'fs/promises';
import sqlite3 from 'sqlite3';
import { run_query } from "../src/tables/table_type";

export async function init_database() : Promise<sqlite3.Database> {
    console.log(`using db folder path: ${config.ROOT_REPO}`);

    // Wait for folder access check
    await fs.access(config.ROOT_REPO, fs.constants.R_OK)
        .then(() => {
            console.log("access to db folder: OK");
        })

    const full_path: string = path.join(config.ROOT_REPO, config.DB_NAME);
    console.log(`Using this file for database: ${full_path}`);

    // Wait for file access check
    await fs.access(full_path, fs.constants.R_OK | fs.constants.W_OK)
        .then(() => {
            console.log("access to db file: OK");
        })
        .catch((err: NodeJS.ErrnoException) => {
            if (err.code === 'ENOENT') {
                console.log('db file did not previously exist');
            } else {
                throw new Error(err.message);
            }
        });

    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(full_path, (err) => {
            if (err) {
                reject(new Error(`error opening DB: ${err.message}`));
            } else {
                console.log('database open: OK');
                resolve(db);
            }
        });
    });
}

export async function create_tables() : Promise<void> {

    // Create tables if the do not exist yet
    // 1.) users
    try {
        await run_query(
            `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_name TEXT,
                time_created DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_name)
            );
            `, 
            []
        );
        console.log("created users table");
    }
    catch (err) {
        console.log("Issue creating users table ", err);
    }

    // 2.) books
    try {
        await run_query(
            `
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                page_count INTEGER,
                chapters INTEGER,
                description TEXT,
                UNIQUE(title, author)
            );
            `,
            []
        );
        console.log("created books table");
    } catch (err) {
        console.log("Issue creating books table ", err);
    }

}

// // Create table if not exists
// db.run(`
// CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     age INTEGER NOT NULL
// )
// `, (err) => {
// if (err) {
//     console.error('Error creating table:', err.message);
//     return;
// }
// console.log('Table created or already exists.');

// // Insert a user
// db.run(`INSERT INTO users (name, age) VALUES (?, ?)`, ['Alice', 30], function (err) {
//             if (err) {
//                 console.error('error inserting row:', err.message);
//                 return;
//             }

//             console.log(`inserted user with id ${this.lastID}`);

//             // Query the inserted user back
//             db.get(`SELECT id, name, age FROM users WHERE id = ?`, [this.lastID], (err, row) => {
//             if (err) {
//                 console.error('error querying row:', err.message);
//                 return;
//             }

//             console.log('queried user:', row);

//             // Close the database after operations
//             db.close((err) => {
//                 if (err) {
//                 console.error('error closing database:', err.message);
//                 } else {
//                 console.log('database closed');
//                 }
//             });
//         });
//     })
// });