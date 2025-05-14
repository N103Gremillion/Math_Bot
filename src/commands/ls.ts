import { ChatInputCommandInteraction } from "discord.js";
import { send_message } from "../events/message";

const commands_string : string = `1.) ,ping - pings Math Bot and shows latency
2.) ,ls - list info about Math Bot commands
`;

function is_ls(command : string) : boolean {
    if (command == "ls") {
        return true;
    }
    return false;
}

async function execute_ls(cmd : ChatInputCommandInteraction) : Promise<void> {
    const block_commands_string : string = `\`\`\`\n${commands_string}\n\`\`\``;
    await send_message(cmd, block_commands_string);
}

export {is_ls, execute_ls}