import dotenv from "dotenv";

dotenv.config();

const {DISCORD_TOKEN, CLIENT_ID, SERVER_ID} = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !SERVER_ID) {
  throw new Error("Eviornment variable not present");
}

export const config = {
  DISCORD_TOKEN,
  CLIENT_ID,
  SERVER_ID
};