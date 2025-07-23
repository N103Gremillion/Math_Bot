import { ChatInputCommandInteraction } from "discord.js";
import { wrap_str_in_code_block } from "../../utils/util";
import { Command, CommandType, CommandStringType } from "../command_types";
import { check_user_registered, fetch_user_id } from "../../tables/users";
import { fetch_user_skillpoints_query, increment_user_skillpoints_query, set_user_skillpoints_query } from "../../tables/user_skillpoints";

export async function increment_skill_points_handler (cmd : ChatInputCommandInteraction) : Promise<void> {
  const user_name : string  = cmd.user.username;
  const is_registered : boolean = await check_user_registered(user_name); 

  if (!is_registered) {
    await cmd.reply("Please register before incrementing skillpoints");
    return;
  }

  const inc_skill_points : number = cmd.options.getInteger("increment", true)!;
  const user_id: number = await fetch_user_id(user_name);
  let skillpoints: number | undefined = await fetch_user_skillpoints_query(user_id);

  /**
   * this should never happen since we set the user
   * skillpoints to 0 when they register... but just in case
   */
  if(skillpoints === undefined)
    await set_user_skillpoints_query(user_id, 0);
  
  await increment_user_skillpoints_query(user_id, inc_skill_points);
  skillpoints = await fetch_user_skillpoints_query(user_id);

  /**
   * again shouldn't happen, but let's just default 0 here
   */
  if(skillpoints === undefined)
      skillpoints = 0;

  await cmd.reply(
    wrap_str_in_code_block(
        `Incremented skillpoints by ${inc_skill_points}, current skill points: ${skillpoints}`
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