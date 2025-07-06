import { ChatInputCommandInteraction } from "discord.js";

export enum COMMAND_TYPE {
  INVALID,
  PING,
  LS,
  REIGSTER_USER,
  REMOVE_USER,
  REGISTER_BOOK,
  REMOVE_BOOK,
  VIEW_BOOKS,
  VIEW_BOOK_INFO,
  REGISTER_CHAPTER,
  VIEW_CHAPTERS,
  REGISTER_SECTION
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

  // tells if the function takes parameter
  requires_params : boolean;
}