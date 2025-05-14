import { Channel } from "discord.js";
import { send_message } from "../events/message";

function is_ping(command : string) : boolean{
  if (command == "ping") {
      return true;
  }
  return false;
}

function execute_ping (channel : Channel, cmd_creation_time : number) : void {
  const latency : number = Date.now() - cmd_creation_time;
  const ping_string : string = `Pinged Math Bot! \nMessage Latency: ${latency}ms`;
  const block_string = `\`\`\`\n${ping_string}\n\`\`\``;
  send_message(block_string, channel);
}

export { is_ping, execute_ping }