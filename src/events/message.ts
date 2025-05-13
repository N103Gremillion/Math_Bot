import {
    TextChannel,
    DMChannel,
    NewsChannel,
    Message,
    Channel
} from "discord.js";
import { bot } from "../bot";

async function send_message(out_string : string, msg : Message) : Promise<void> {
    let channel : Channel | null = await bot.channels.fetch(msg.channelId);
    if (!channel) {
        console.log("Null channel");
        return;
    }

    // make sure the channel is a valid to send a message in
    if (channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel) {
        await channel.send(out_string);
    } else {
        console.log("Can't send msg in this channel type.");
    }
}

export { send_message }