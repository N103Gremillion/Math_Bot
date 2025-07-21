import { ChatInputCommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { Command, COMMAND_TYPE, COMMAND_TYPE_STRING } from "../command_types";
import { select_book_users_reading } from "../selection_menus";
import { fetch_page_of_logs, ProgressLogsInfo } from "../../tables/progress_logs";
import { get_logs_str, get_user_id_from_interaction } from "../../utils/util";
import { BookInfo, fetch_book_and_author_info } from "../../tables/books";

export const LOGS_PER_PAGE : number = 15;

export async function execute_view_logs(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_users_reading(cmd);
}

export async function continue_executing_view_logs(
  page : number,
  book_isbn : string,
  interaction : StringSelectMenuInteraction
) : Promise<void> {

  const user_id : number = await get_user_id_from_interaction(interaction);
  const logs : ProgressLogsInfo[] = await fetch_page_of_logs(user_id, book_isbn, page);
  const book : BookInfo | null = await fetch_book_and_author_info(book_isbn);

  const logs_response : string = get_logs_str(book, logs, page);

  interaction.reply(logs_response);
}

export const view_logs_command : Command = {
  command : COMMAND_TYPE_STRING.VIEW_LOGS,
  command_type : COMMAND_TYPE.VIEW_LOGS,
  description : "View a page of your past logs for a certian book.",
  action : execute_view_logs,
  requires_params : false
}