import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { send_message } from "../../events/message";
import { wrap_str_in_code_block } from "../../utils/util";
import { Command, COMMAND_TYPE, COMMAND_TYPE_STRING, default_command_builder } from "../command_types";
import { commands_g } from "../../entry";

export const ls_command: Command = {
    command_type: COMMAND_TYPE.LS,
    command: COMMAND_TYPE_STRING.LS,
    description: "List commands and their descriptions",
    action: execute_ls,
    command_builder : ls_command_builder
}

export function ls_command_builder(cmd : Command) : SlashCommandBuilder {
    return default_command_builder(cmd);
}

export async function execute_ls(cmd : ChatInputCommandInteraction) : Promise<void> {

    let commands_string : string = ``;

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
