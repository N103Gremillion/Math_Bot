import { init_client } from "./events/setup_bot";
import { Client } from "discord.js";
import { Command } from "./commands/command_types";

import { init_database, create_tables, view_database} from "../src_dev/database_entry";
import sqlite3 from 'sqlite3';

// commands
import { ls_command } from "./commands/misc/ls";
import { ping_command } from "./commands/misc/ping";
import { register_user_command } from "./commands/users/register_user";
import { remove_user_command } from "./commands/users/remove_user";
import { register_book_command } from "./commands/books/register_book";
import { register_chapter_command } from "./commands/chapters/register_chapter";
import { view_books_command } from "./commands/books/view_books";
import { view_book_info_command } from "./commands/books/view_book_info";
import { view_chapters_command } from "./commands/chapters/view_chapters";
import { register_section_command } from "./commands/sections/register_section";
import { remove_book_command } from "./commands/books/remove_book";
import { help_command } from "./commands/misc/help";
import { register_total_chapters_command } from "./commands/books/register_total_chapters";
import { add_to_bookshelf_command } from "./commands/bookshelf/add_to_bookshelf";
import { remove_from_bookshelf_command } from "./commands/bookshelf/remove_from_bookshelf";
import { drop_bookshelf_command } from "./commands/bookshelf/drop_bookshelf";
import { view_bookshelf_command } from "./commands/bookshelf/view_bookshelf";
import { start_reading_command } from "./commands/bookshelf/start_reading";
import { log_progress_command } from "./commands/progress_logs/log_progress";
import { view_logs_command } from "./commands/progress_logs/view_logs";
import { view_progress_graph_command } from "./commands/progress_logs/view_progress_graph";
import { increment_skill_points } from "./commands/user_skillpoints/increment_skill_points";
import { view_all_skill_points } from "./commands/user_skillpoints/view_all_skill_points";


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
    view_bookshelf_command,
    start_reading_command,
    log_progress_command,
    view_logs_command,
    view_progress_graph_command,
    increment_skill_points,
    view_all_skill_points,
];

// initalize globals 
let bot_g : Client;
let database_g : sqlite3.Database;

async function main () : Promise<void> {
    database_g = await init_database();
    // await run_query("PRAGMA foreign_keys = ON;");
    await create_tables();
    // await insert_modern_operating_systems(); 
    // await insert_how_to_prove_it();  
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


