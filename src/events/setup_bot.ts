import { CommandType } from './../commands/command_types';
import { Client, GatewayIntentBits, Interaction, ModalSubmitInteraction, SlashCommandBuilder, StringSelectMenuInteraction } from "discord.js";
import { config } from "../../src_shared/config";
import { execute_command } from "../commands/command";
import { commands_g } from "../entry";
import { Command } from "../commands/command_types";
import { handle_menu_select } from '../commands/selection_menus';
import { BookField } from '../commands/books/book_field';
import { handleModalSubmit } from '../commands/modals';

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
      commands.push(cmd.command_builder(cmd));
    });
    
    await guild.commands.set(commands);
  });

  setup_command_listener(client);
  client.login(config.DISCORD_TOKEN);

  return client;
}

function setup_command_listener(client : Client) : void {
  client.on('interactionCreate', async (interaction : Interaction) : Promise<void> => {

    // for menu selection events
    if (interaction.isStringSelectMenu()) {
      await handle_menu_select(interaction as StringSelectMenuInteraction);
      return;
    }
    
    // for modal submitions
    if (interaction.isModalSubmit()) {
      await handleModalSubmit(interaction as ModalSubmitInteraction);
    }

    // ignore bot messages
    if (!interaction.isChatInputCommand()) return;
    const cmd = interaction;
  
    await execute_command(cmd);
  });
}
