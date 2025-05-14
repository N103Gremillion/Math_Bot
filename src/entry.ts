import { init_client } from "./events/setup_bot";
import { Client } from "discord.js";
import { Command } from "./commands/command_types";
import { ls_command } from "./commands/ls";
import { ping_command } from "./commands/ping";

// setup list of all commands
export const commands_g: Command[] = [
    ping_command,
    ls_command
]

// global bot instance
export const bot_g: Client = init_client();
