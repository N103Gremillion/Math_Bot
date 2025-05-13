// setup
import { Client, GatewayIntentBits } from "discord.js";
import { config } from "../config";
import { COMMAND_TYPE } from "../commands/command_types";
import { check_message } from "../commands/validate";

export function init_client() : Client {
  // setup intents for bot and create instance
  const client = new Client({
    intents : [
      GatewayIntentBits.DirectMessagePolls,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.Guilds, 
      GatewayIntentBits.GuildMessages, 
    ],
  });

  // bot logs in when it's ready
  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.username}!`)
  });

  setup_message_listener(client);
  client.login(config.DISCORD_TOKEN);

  return client;
}

function setup_message_listener( client : Client) : void {
  // Listen for messages and print info
  client.on("messageCreate", msg => {
    // ignore bot messages
    if (msg.author.bot) return;

    check_message(msg);
    
  });
}