import {
    ChatInputCommandInteraction
} from "discord.js";

async function send_message(cmd : ChatInputCommandInteraction, response_string : string) : Promise<void> {
    await cmd.editReply(response_string);
}

export { send_message }