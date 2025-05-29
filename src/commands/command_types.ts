import { ChatInputCommandInteraction } from "discord.js";

export enum COMMAND_TYPE {
  INVALID,
  PING,
  LS,
  REIGSTER_USER
}

export type Command = {
  // string user must type excluding starting
  command: string;
  // internal enum type of the command
  command_type: COMMAND_TYPE;
  /**
   * string displayed to user if command used incorrectly
   * or if user types command with help
   */
  description: string;
  // function to run when command is received
  action: (cmd : ChatInputCommandInteraction) => Promise<void>; 
}