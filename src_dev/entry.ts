import path from "path";
import { config } from "../src_shared/config";
import fs from 'fs/promises';
import sqlite3 from 'sqlite3';

console.log(`using db folder path: ${config.ROOT_REPO}`);
fs.access(config.ROOT_REPO, fs.constants.R_OK)
    .then(() => {
        console.log("access to db folder: OK");
    })

const full_path: string = path.join(config.ROOT_REPO, config.DB_NAME);

console.log(`using db name: ${config.ROOT_REPO}`);
fs.access(full_path, fs.constants.R_OK | fs.constants.W_OK)
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

const db: sqlite3.Database = new sqlite3.Database('./mydb.sqlite', (err) => {
        if (err) {
            throw new Error(`error opening DB: ${err.message}`);
        } else {
            console.log('database open: OK');
        }
    });

// Create table if not exists
db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL
)
`, (err) => {
if (err) {
    console.error('Error creating table:', err.message);
    return;
}
console.log('Table created or already exists.');

// Insert a user
db.run(`INSERT INTO users (name, age) VALUES (?, ?)`, ['Alice', 30], function (err) {
            if (err) {
                console.error('error inserting row:', err.message);
                return;
            }

            console.log(`inserted user with id ${this.lastID}`);

            // Query the inserted user back
            db.get(`SELECT id, name, age FROM users WHERE id = ?`, [this.lastID], (err, row) => {
            if (err) {
                console.error('error querying row:', err.message);
                return;
            }

            console.log('queried user:', row);

            // Close the database after operations
            db.close((err) => {
                if (err) {
                console.error('error closing database:', err.message);
                } else {
                console.log('database closed');
                }
            });
        });
    })
});