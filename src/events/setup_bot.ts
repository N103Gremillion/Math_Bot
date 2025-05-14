import { Client, GatewayIntentBits, Interaction, SlashCommandBuilder } from "discord.js";
import { config } from "../config";
import { execute_command } from "../commands/command";
import { commands_g } from "../entry";

export function init_client() : Client {
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

  client.on("ready", async () => {
    console.log(`logged in as ${client.user?.username}!`);

    const guild = await client.guilds.fetch(config.SERVER_ID);
    const commands: SlashCommandBuilder[] = [];

    commands_g.forEach(cmd => {
      commands.push(new SlashCommandBuilder().setName(cmd.command).setDescription(cmd.description));
    });
    
    await guild.commands.set(commands);
  });

  setup_command_listener(client);
  client.login(config.DISCORD_TOKEN);

  return client;
}

function setup_command_listener(client : Client) : void {
  client.on('interactionCreate', async (interaction : Interaction) : Promise<void> => {
    // ignore bot messages
    if (!interaction.isChatInputCommand()) return;
    const cmd = interaction;

    await execute_command(cmd);
  });
}