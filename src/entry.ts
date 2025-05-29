import { init_client } from "./events/setup_bot";
import { Client } from "discord.js";
import { Command } from "./commands/command_types";
import { ls_command } from "./commands/ls";
import { ping_command } from "./commands/ping";
import { register_user_command } from "./commands/register_user";
import { init_database } from "../src_dev/entry";
import sqlite3 from 'sqlite3';

// setup list of all commands
export const commands_g: Command[] = [
    ping_command,
    ls_command,
    register_user_command
]

// global bot instance
export const bot_g: Client = init_client();

// global database instance 
export const database_g : Promise<sqlite3.Database> = init_database();

