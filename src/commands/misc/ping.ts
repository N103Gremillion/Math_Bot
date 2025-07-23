import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { send_message } from "../../events/message";
import { wrap_str_in_code_block } from "../../utils/util";
import { Command, CommandType, CommandStringType, default_command_builder } from "../command_types";

export const ping_command: Command = {
  command_type: CommandType.PING,
  command: CommandStringType.PING,
  description: "Ping server and display latency",
  action: execute_ping,
  command_builder: ping_command_builder
}

export function ping_command_builder(cmd : Command) : SlashCommandBuilder {
  return default_command_builder(cmd);
}

export async function execute_ping (cmd : ChatInputCommandInteraction) : Promise<void> {
  const latency = Date.now() - cmd.createdTimestamp;
  const ping_string = `Pinged Math Bot! \nMessage Latency: ${latency}ms`;
  const block_string = wrap_str_in_code_block(ping_string);

  await send_message(cmd, block_string);
}






