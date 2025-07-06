import path from "path";
import { config } from "../src_shared/config";
import fs from 'fs/promises';
import sqlite3 from 'sqlite3';
import { clear_table, run_query, TABLE_TYPE, view_table } from "../src/tables/table_type";
import { clear } from "console";
import { insert_dummy_data } from "./dummy_data";

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
                user_name TEXT NOT NULL,
                time_created DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_name)
            );
            `, 
            []
        );
        console.log("Created users table");
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
        console.log("Created books table");
    } catch (err) {
        console.log("Issue creating books table ", err);
    }

    // 3.) reading (maps userId's to bookId's)
    try {
        await run_query(
            `
            CREATE TABLE IF NOT EXISTS reading (
                user_id INTEGER,
                book_id INTEGER,
                start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
                cur_page INTEGER NOT NULL,

                PRIMARY KEY (user_id, book_id),

                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE 
            );
            `
            , []
        );
        console.log("Created reading table ");
    } catch (err) {
        console.log("Issue when creating reading table ", err);
    }

    // 4.) chapters
    try {
        await run_query(
            `
            CREATE TABLE IF NOT EXISTS chapters (
                book_id INTEGER,
                chapter_name TEXT NOT NULL,
                chapter_number INTEGER NOT NULL,
                sections INTEGER NOT NULL,
                start_page INTEGER NOT NULL,
                end_page INTEGER NOT NULL,

                PRIMARY KEY (book_id, chapter_number),

                FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,

                CHECK (start_page <= end_page)
            );
            `,
            []
        );
        console.log("Created chapters table");
    } catch (err) {
        console.log("Issue creating chapters table ", err);
    }

    // 5.) sections
    try {
        await run_query(
            `
            CREATE TABLE IF NOT EXISTS sections (
                book_id INTEGER,
                chapter_number INTEGER,
                section_number INTEGER NOT NULL,
                section_name TEXT NOT NULL,
                start_page INTEGER NOT NULL,
                end_page INTEGER NOT NULL,
                total_questions INTEGER NOT NULL,

                PRIMARY KEY (book_id, chapter_number, section_number),

                FOREIGN KEY (book_id, chapter_number) 
                REFERENCES chapters(book_id, chapter_number)
                ON DELETE CASCADE,

                CHECK (start_page <= end_page)
            );
            `,
            []
        );
        console.log("Created sections table");
    } catch (err) {
        console.log("Issue creating sections table ", err);
    }
    
    // 6.) progress_logs
    try {
        await run_query(
            `
            CREATE TABLE IF NOT EXISTS progress_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                book_id INTEGER,
                start_page INTEGER,
                end_page INTEGER,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (book_id) REFERENCES books(id)
            );
            `, 
            []
        );
        console.log("Created progress_logs table");
    } catch (err) {
        console.log("Issue creating progress_logs table ", err);
    } 
}   

export async function clear_database() : Promise<void> {
    try {
        await clear_table(TABLE_TYPE.USERS);
        await clear_table(TABLE_TYPE.BOOKS);
        await clear_table(TABLE_TYPE.READING);
        await clear_table(TABLE_TYPE.CHAPTERS);
        await clear_table(TABLE_TYPE.SECTIONS);
        await clear_table(TABLE_TYPE.PROGRESS_LOGS);
        console.log("Database cleared");
    } catch (err) {
        console.log("Issue clearing the database ", err);
    }
}

export async function view_database() : Promise<void> {
    const allTableTypes: TABLE_TYPE[] = Object.values(TABLE_TYPE) as TABLE_TYPE[];

    for (const table of allTableTypes) {
        if (table === TABLE_TYPE.INVALID) {
            continue;
        }
        await view_table(table); 
    }
}

export async function reset_database_with_dummy_data() : Promise<void> {
    await clear_database();
    await insert_dummy_data();
}
