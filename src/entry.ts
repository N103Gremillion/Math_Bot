import { init_client } from "./events/setup_bot";
import { Client } from "discord.js";
import { Command } from "./commands/command_types";

import { init_database, create_tables, clear_database, view_database, drop_database} from "../src_dev/database_entry";
import sqlite3 from 'sqlite3';

// commands
import { ls_command } from "./commands/misc/ls";
import { ping_command } from "./commands/misc/ping";
import { register_user_command } from "./commands/users/register_user";
import { clear_table, run_query, TABLE_TYPE, view_table } from "./tables/table_type";
import { remove_user_command } from "./commands/users/remove_user";
import { register_book_command } from "./commands/books/register_book";
import { register_chapter_command } from "./commands/chapters/register_chapter";
import { view_books_command } from "./commands/books/view_books";
import { view_book_info_command } from "./commands/books/view_book_info";
import { view_chapters_command } from "./commands/chapters/view_chapters";
import { register_section_command } from "./commands/sections/register_section";
import { remove_book_command } from "./commands/books/remove_book";
import { clear } from "console";
import { help_command } from "./commands/misc/help";
import { register_total_chapters_command } from "./commands/books/register_total_chapters";
import { add_to_bookshelf_command } from "./commands/bookshelf/add_to_bookshelf";
import { remove_from_bookshelf_command } from "./commands/bookshelf/remove_from_bookshelf";
import { drop_bookshelf_command } from "./commands/bookshelf/drop_bookshelf";
import { view_bookshelf_command } from "./commands/bookshelf/view_bookshelf";


// setup list of all commands
export const commands_g: Command[] = [
    ping_command,
    ls_command,
    register_user_command,
    remove_user_command,
    register_book_command,
    remove_book_command,
    view_books_command,
    view_book_info_command,
    register_chapter_command,
    view_chapters_command,
    register_section_command,
    help_command,
    register_total_chapters_command,
    add_to_bookshelf_command,
    remove_from_bookshelf_command,
    drop_bookshelf_command,
    view_bookshelf_command
];

// initalize globals 
let bot_g : Client;
let database_g : sqlite3.Database;

async function main () : Promise<void> {
    database_g = await init_database();
    // await run_query("PRAGMA foreign_keys = ON;");
    // await drop_database();
    await create_tables();  
    bot_g = init_client();  
    await view_database();   
} 
   
main() 
    .then(() => { 
    })
    .catch ((error) => {  
        console.log(error);
    })
    .finally(() => {  
    });  

export { bot_g, database_g };


