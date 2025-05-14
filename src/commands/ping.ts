import { ChatInputCommandInteraction } from "discord.js";
import { send_message } from "../events/message";

function is_ping(command : string) : boolean{
  if (command == "ping") {
      return true;
  }
  return false;
}

async function execute_ping (cmd : ChatInputCommandInteraction) : Promise<void> {
  const latency : number = Date.now() - cmd.createdTimestamp;
  const ping_string : string = `Pinged Math Bot! \nMessage Latency: ${latency}ms`;
  const block_string = `\`\`\`\n${ping_string}\n\`\`\``;
  await send_message(cmd, block_string);
}

export { is_ping, execute_ping }