import { init_client } from "./events/setup_bot";
import { Client } from "discord.js";
import { Command } from "./commands/command_types";

import { init_database } from "../src_dev/entry";
import sqlite3 from 'sqlite3';

// commands
import { ls_command } from "./commands/misc/ls";
import { ping_command } from "./commands/misc/ping";
import { register_user_command } from "./commands/users/register_user";



// setup list of all commands
export const commands_g: Command[] = [
    ping_command,
    ls_command,
    register_user_command
];

// initalize globals 
let bot_g : Client;
let database_g : sqlite3.Database;

async function main () : Promise<void> {
    database_g = await init_database();
    bot_g = init_client();
}

main()
    .then(() => {
        console.log("Main Finished");
    })
    .catch ((error) => {
        console.log(error);
    });

export { bot_g, database_g };


