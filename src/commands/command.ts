import { SlashCommandBuilder } from "discord.js";

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Pings bot'),
  new SlashCommandBuilder().setName('ls').setDescription('list Math Bot commands')
];

export { commands };