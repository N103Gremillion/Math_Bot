import { ChatInputCommandInteraction } from "discord.js";

export enum COMMAND_TYPE_STRING {
  INVALID = "invalid",
  PING = "ping",
  LS = "ls",
  REGISTER_USER = "register_user",
  REMOVE_USER = "remove_user",
  REGISTER_BOOK = "register_book",
  REMOVE_BOOK = "remove_book",
  VIEW_BOOKS = "view_books",
  VIEW_BOOK_INFO = "view_book",
  REGISTER_CHAPTER = "register_chapter",
  VIEW_CHAPTERS = "view_chapters",
  REGISTER_SECTION = "register_section",
  HELP = "help",
  REGISTER_TOTAL_CHAPTERS = "register_total_chapters",
  ADD_TO_BOOKSHELF = "add_to_bookshelf",
  REMOVE_FROM_BOOKSHELF = "remove_from_bookshelf",
  DROP_BOOKSHELF = "drop_bookshelf",
  VIEW_BOOKSHELF = "view_bookshelf",
  START_READING = "start_reading",
  LOG_PROGRESS = "log_progress",
  VIEW_LOGS = "view_logs",
  VIEW_PROGRESS_GRAPH = "view_progress_graph",
} 

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
  REGISTER_SECTION,
  HELP,
  REGISTER_TOTAL_CHAPTERS,
  ADD_TO_BOOKSHELF,
  REMOVE_FROM_BOOKSHELF,
  DROP_BOOKSHELF,
  VIEW_BOOKSHELF,
  START_READING,
  LOG_PROGRESS,
  VIEW_LOGS,
  VIEW_PROGRESS_GRAPH,
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