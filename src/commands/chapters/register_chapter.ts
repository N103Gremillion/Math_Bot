import { Interaction, StringSelectMenuInteraction } from 'discord.js';
import { Command, COMMAND_TYPE } from './../command_types';
import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { select_book_menu } from '../selection_menus';

export async function execute_register_chapter(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_menu(cmd);
}

export async function get_chapter_info(interaction : StringSelectMenuInteraction, book_selected : string | undefined) : Promise<void> {
  const modal = new ModalBuilder()
  .setCustomId(`chapter_input_modal|${book_selected}`)
  .setTitle("Enter Chapter Details")
  .addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId("chapter_name")
        .setLabel("Chapter Name")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId("chapter_number")
        .setLabel("Chapter Number")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    )
  );

  await interaction.showModal(modal);
}

export const register_chapter_command : Command = {
  command : "register_chapter",
  command_type : COMMAND_TYPE.REGISTER_CHAPTER,
  description : "register a chapter in one of the books in the database",
  action : execute_register_chapter,
  requires_params : true
}
