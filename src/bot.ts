import {init_client} from "./events/setup_bot";
import { Client } from "discord.js";

// global instance of bot that will be used all over the place
const bot: Client = init_client();

export { bot };
