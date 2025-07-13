import { ChatInputCommandInteraction } from "discord.js";
import { Command, COMMAND_TYPE, COMMAND_TYPE_STRING } from "../command_types";
import { get_user_id_from_interaction, wrap_str_in_code_block } from "../../utils/util";
import { clear_bookshelf } from "../../tables/bookshelf";

async function  execute_drop_bookshelf(cmd : ChatInputCommandInteraction) : Promise<void> {
  const user_id : number = await get_user_id_from_interaction(cmd);
  const successfuly_cleared : boolean = await clear_bookshelf(user_id);

  if (successfuly_cleared) {
    cmd.reply(
      wrap_str_in_code_block(
        `Bookshelf cleared successfuly.`
      )
    );
  } else {
    cmd.reply(
      wrap_str_in_code_block(
        `Issue clearing bookshelf.`
      )
    );
  }
}

export const drop_bookshelf_command : Command = {
  command: COMMAND_TYPE_STRING.DROP_BOOKSHELF,
  command_type: COMMAND_TYPE.DROP_BOOKSHELF,
  description: "Remove all the books from your bookshelf.",
  action: execute_drop_bookshelf,
  requires_params : false
}