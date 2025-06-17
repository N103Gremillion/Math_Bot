import { Client, GatewayIntentBits, Interaction, SlashCommandBuilder } from "discord.js";
import { config } from "../../src_shared/config";
import { execute_command } from "../commands/command";
import { commands_g } from "../entry";
import { Command } from "../commands/command_types";

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
      if (cmd.requires_params) {
        const slash_command : SlashCommandBuilder = setup_SlashCommand_with_params(cmd);
        commands.push(slash_command);
      } else {
        commands.push(new SlashCommandBuilder().setName(cmd.command).setDescription(cmd.description));
      }
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

function setup_SlashCommand_with_params(cmd: Command): SlashCommandBuilder {
  if (cmd.command === "register_book") {
    return new SlashCommandBuilder()
      .setName(cmd.command)
      .setDescription(cmd.description)
      .addStringOption(option =>
        option.setName("title").setDescription("Title of the book").setRequired(true)
      )
      .addStringOption(option =>
        option.setName("author").setDescription("Author of the book").setRequired(true)
      )
      .addIntegerOption(option =>
        option.setName("pages").setDescription("Page count").setRequired(true)
      )
      .addIntegerOption(option =>
        option.setName("chapters").setDescription("Chapter count").setRequired(true)
      )
      .addStringOption(option =>
        option.setName("description").setDescription("Short description of book").setRequired(true)
      ) as SlashCommandBuilder;
  } else {
    return new SlashCommandBuilder()
      .setName(cmd.command)
      .setDescription(cmd.description);
  }
}