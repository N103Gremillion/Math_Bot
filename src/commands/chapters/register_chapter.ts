import { Interaction, StringSelectMenuInteraction } from 'discord.js';
import { Command, COMMAND_TYPE } from './../command_types';
import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { select_book_menu } from '../selection_menus';
import { ModalType } from '../modals';
import { ChapterField } from './ChapterField';

export async function execute_register_chapter(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_menu(cmd);
}

export async function get_chapter_info(interaction : StringSelectMenuInteraction, book_selected : string) : Promise<void> {

  const modal = new ModalBuilder()
  .setCustomId(`${ModalType.ChapterInput}|${book_selected}`)
  .setTitle("Enter Chapter Details")
  .addComponents(
    // get components
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(ChapterField.ChapterName)
        .setLabel("Chapter Name")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(ChapterField.ChapterNumber)
        .setLabel("Chapter Number")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(ChapterField.StartPage)
        .setLabel("Start Page")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(ChapterField.EndPage)
        .setLabel("End Page")
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
