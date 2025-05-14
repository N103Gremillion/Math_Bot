import { ChatInputCommandInteraction } from "discord.js";
import { send_message } from "../events/message";
import { wrap_str_in_code_block } from "../util";
import { Command, COMMAND_TYPE } from "./command_types";

const commands_string : string = `
1.) ,ping - pings Math Bot and shows latency
2.) ,ls - list info about Math Bot commands
`;

export async function execute_ls(cmd : ChatInputCommandInteraction) : Promise<void> {
    const block_commands_string : string = wrap_str_in_code_block(commands_string);
    await send_message(cmd, block_commands_string);
}

export const ls_command: Command = {
    command_type: COMMAND_TYPE.LS,
    command: "ls",
    description: "List commands and their descriptions",
    action: execute_ls
}