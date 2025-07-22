import { ChatInputCommandInteraction } from "discord.js";
import { send_message } from "../../events/message";
import { wrap_str_in_code_block } from "../../utils/util";
import { Command, CommandType, CommandStringType } from "../command_types";
import { commands_g } from "../../entry";

let commands_string : string = ``;

export async function execute_ls(cmd : ChatInputCommandInteraction) : Promise<void> {
    if(!commands_string) {
        let cur_cmd = 1;
        commands_g.forEach(cmd => {
            commands_string += `${cur_cmd++}) ${cmd.command} - ${cmd.description}`;
            if(cur_cmd <= commands_g.length) {
                commands_string += `\n`;
            }
        });
    }

    const block_commands_string : string = wrap_str_in_code_block(commands_string);
    await send_message(cmd, block_commands_string);
}

export const ls_command: Command = {
    command_type: CommandType.LS,
    command: CommandStringType.LS,
    description: "List commands and their descriptions",
    action: execute_ls,
    requires_params : false
}