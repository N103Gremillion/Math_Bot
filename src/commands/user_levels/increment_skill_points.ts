import { ChatInputCommandInteraction } from "discord.js";
import { wrap_str_in_code_block } from "../../utils/util";
import { Command, CommandType, CommandStringType } from "../command_types";
import { check_user_registered, insert_users_table } from "../../tables/users";

export async function increment_skill_points_handler (cmd : ChatInputCommandInteraction) : Promise<void> {
  await cmd.deferReply();

  const pending_response : string = `Incrementing user skillpoints\n`;

  await cmd.editReply(wrap_str_in_code_block(pending_response));

  const inc_skill_points : number = cmd.options.getInteger("increment", true)!;

  await cmd.editReply(
    wrap_str_in_code_block(
        `Incremented skillpoints by ${inc_skill_points}`
    )
   );
}

export const increment_skill_points: Command = {
    command_type: CommandType.INCREMENT_SKILL_POINTS,
    command: CommandStringType.INCREMENT_SKILL_POINTS,
    description: "Increment the skill points of a user",
    action: increment_skill_points_handler,
    requires_params : true
}