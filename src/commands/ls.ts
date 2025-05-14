import { ChatInputCommandInteraction } from "discord.js";
import { send_message } from "../events/message";
import { wrap_str_in_code_block } from "../util";
import { Command, COMMAND_TYPE } from "./command_types";
import { commands_g } from "../entry";

let commands_string : string = ``;

export async function execute_ls(cmd : ChatInputCommandInteraction) : Promise<void> {
    if(!commands_string) {
        let cur_cmd = 1;
        commands_g.forEach(cmd => {
            commands_string += `${cur_cmd++}) ${cmd.command} - ${cmd.description}`;
            if(cur_cmd != commands_g.length - 1) {
                commands_string += `\n`;
            }
        });
    }

    const block_commands_string : string = wrap_str_in_code_block(commands_string);
    await send_message(cmd, block_commands_string);
}

export const ls_command: Command = {
    command_type: COMMAND_TYPE.LS,
    command: "ls",
    description: "List commands and their descriptions",
    action: execute_ls
}