import {
    ChatInputCommandInteraction
} from "discord.js";

export async function send_message(cmd : ChatInputCommandInteraction, 
                                   response_string : string) : Promise<void> {
    await cmd.reply(response_string);
}
