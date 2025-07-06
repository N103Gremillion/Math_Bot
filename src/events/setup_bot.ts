import { COMMAND_TYPE } from './../commands/command_types';
import { Client, GatewayIntentBits, Interaction, ModalSubmitInteraction, SlashCommandBuilder, StringSelectMenuInteraction } from "discord.js";
import { config } from "../../src_shared/config";
import { execute_command } from "../commands/command";
import { commands_g } from "../entry";
import { Command } from "../commands/command_types";
import { handle_menu_select } from '../commands/selection_menus';
import { BookField } from '../commands/books/BookField';
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

function setup_SlashCommand_with_params(cmd: Command): SlashCommandBuilder {
  if (cmd.command_type === COMMAND_TYPE.REGISTER_BOOK) {
    return new SlashCommandBuilder()
      .setName(cmd.command)
      .setDescription(cmd.description)
      .addStringOption(option =>
        option.setName(BookField.BookTitle).setDescription("Title of the book").setRequired(true)
      )
      .addStringOption(option =>
        option.setName(BookField.Author).setDescription("Author of the book").setRequired(true)
      )
      .addIntegerOption(option =>
        option.setName(BookField.PageCount).setDescription("Page count").setRequired(true)
      )
      .addIntegerOption(option =>
        option.setName(BookField.TotalChapters).setDescription("Chapter count").setRequired(true)
      )
      .addStringOption(option =>
        option.setName(BookField.Description).setDescription("Short description of book").setRequired(true)
      ) 
      .addIntegerOption(option =>
        option.setName(BookField.Edition).setDescription("The edition of the book").setRequired(true)
      )as SlashCommandBuilder;
  } 
  else {
    return new SlashCommandBuilder()
      .setName(cmd.command)
      .setDescription(cmd.description);
  }
}

