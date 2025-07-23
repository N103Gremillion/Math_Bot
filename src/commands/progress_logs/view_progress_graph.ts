import { ChatInputCommandInteraction, SlashCommandBuilder, StringSelectMenuInteraction } from "discord.js";
import { Command, CommandType, CommandStringType, default_command_builder } from "../command_types";
import { get_book_progress_chart } from "../../graphs/book_progress";
import { get_user_id_from_interaction, wrap_str_in_code_block } from "../../utils/util";
import { select_book_users_reading } from "../selection_menus";
import { fetch_all_book_logs, ProgressLogsInfo } from "../../tables/progress_logs";
import { BookInfo, fetch_book_and_author_info } from "../../tables/books";

export const view_progress_graph_command : Command = {
  command_type: CommandType.VIEW_PROGRESS_GRAPH,
  command: CommandStringType.VIEW_PROGRESS_GRAPH,
  description: "Shows you a graph of you current progress in a book and the projected progress.",
  action: execute_view_progress_graph,
  command_builder : view_progress_graph_command_builder
}

export function view_progress_graph_command_builder(cmd : Command) : SlashCommandBuilder {
  return default_command_builder(cmd);
}

export async function execute_view_progress_graph(cmd : ChatInputCommandInteraction) : Promise<void> {
  await select_book_users_reading(cmd);
}

export async function continue_executing_view_progress_graph(
  interaction : StringSelectMenuInteraction, 
  book_isbn : string
) : Promise<void> {
  
  const user_id : number = await get_user_id_from_interaction(interaction);
  const book_logs : ProgressLogsInfo[] = await fetch_all_book_logs(user_id, book_isbn);
  const user_name : string = interaction.user.username;
  const book : BookInfo | null = await fetch_book_and_author_info(book_isbn);

  if (!book) {
    interaction.reply(
      wrap_str_in_code_block(
        `Issue getting gook info for the books selected.
book_isbn : ${book_isbn}`
      )
    );
    return;
  }
  const graph : string = await  get_book_progress_chart(user_name, book, book_logs);
  interaction.reply(graph);
}

