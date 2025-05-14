// setup
import { Client, GatewayIntentBits, ChatInputCommandInteraction, Guild } from "discord.js";
import { config } from "../config";
import { commands } from "../commands/command";
import { check_command } from "./validate";

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
  client.on("ready", async () => {

    console.log(`Logged in as ${client.user?.username}!`)
    
    const guild : Guild = await client.guilds.fetch(config.SERVER_ID);
    
    // register all slash commands
    await guild.commands.set(commands);
    
  });

  setup_command_listener(client);

  client.login(config.DISCORD_TOKEN);

  return client;
}

function setup_command_listener(client : Client) : void {
  // Listen for messages and print info
  client.on('interactionCreate', async (interaction : any) : Promise<void> => {
    // ignore bot messages
    if (!interaction.isChatInputCommand()) return;
    const cmd = interaction as ChatInputCommandInteraction;
    await check_command(cmd);
  });
}