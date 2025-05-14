import { ChatInputCommandInteraction } from "discord.js";
import { send_message } from "../events/message";
import { wrap_str_in_code_block } from "../util";
import { Command, COMMAND_TYPE } from "./command_types";

export async function execute_ping (cmd : ChatInputCommandInteraction) : Promise<void> {
  const latency : number = Date.now() - cmd.createdTimestamp;
  const ping_string : string = `Pinged Math Bot! \nMessage Latency: ${latency}ms`;
  const block_string = wrap_str_in_code_block(ping_string);

  await send_message(cmd, block_string);
}

export const ping_command: Command = {
    command_type: COMMAND_TYPE.PING,
    command: "ping",
    description: "FIXME",
    action: execute_ping
}