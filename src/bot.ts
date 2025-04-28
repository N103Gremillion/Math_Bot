

import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./events/deploy_commands";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", () => {
  console.log("Discord bot is ready! 🤖");
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

// client.on("interactionCreate", async (interaction) => {
//   console.log("YO YO YO");
//   if (!interaction.isCommand()) {
//     return;
//   }
//   const { commandName } = interaction;
//   if (commands[commandName as keyof typeof commands]) {
//     commands[commandName as keyof typeof commands].execute(interaction);
//   }
// });

client.on("messageCreate", (message) => {
  // Avoid the bot responding to its own messages
  if (message.author.bot) return;

  if (message.content === "ping") {
    message.reply("Pong!");
  }
});


client.login(config.DISCORD_TOKEN);


