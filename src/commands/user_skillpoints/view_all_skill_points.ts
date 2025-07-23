import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command, CommandType, CommandStringType, default_command_builder } from "../command_types";
import { fetch_all_users_skillpoints_query } from "../../tables/user_skillpoints";

export const view_all_skill_points: Command = {
  command_type: CommandType.VIEW_ALL_SKILLPOINTS,
  command: CommandStringType.VIEW_ALL_SKILLPOINTS,
  description: "View skillpoints for all users",
  action: view_all_skill_points_handler,
  command_builder : view_all_skill_points_command_builder
}

export function view_all_skill_points_command_builder(cmd : Command) : SlashCommandBuilder {
  return default_command_builder(cmd);
}

export async function view_all_skill_points_handler (cmd : ChatInputCommandInteraction) : Promise<void> {
  let users = await fetch_all_users_skillpoints_query();

  console.log('after fetching skillpoints\n');

  if(users.length == 0) {
    await cmd.reply(`No users have skillpoints`);
    return;
  }

  let res = "";
  let cur_user = 1;

  users.forEach(user => {
    res += `${cur_user}.) user name: ${user.user_name}, skillpoints: ${user.skillpoints}\n`;
    cur_user++;
  });

  await cmd.reply(res);
}

