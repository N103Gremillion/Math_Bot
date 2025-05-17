import dotenv from "dotenv";

dotenv.config();

const {DISCORD_TOKEN, CLIENT_ID, SERVER_ID, ROOT_REPO, DB_NAME} = process.env;

if (!DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN not defined");
}

if (!CLIENT_ID) {
  throw new Error("CLIENT_ID not defined");
}

if (!SERVER_ID) {
  throw new Error("SERVER_ID not defined");
}

if(!ROOT_REPO) {
    throw new Error("ROOT_REPO not defined");
}


if(!DB_NAME) {
    throw new Error("ROOT_REPO not defined");
}

export const config = {
  DISCORD_TOKEN,
  CLIENT_ID,
  SERVER_ID,
  ROOT_REPO,
  DB_NAME
};