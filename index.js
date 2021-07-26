require('module-alias/register')
const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("@data/config.json");
const loadCommands = require("@root/commands/load-commands")

client.on("ready", async () => {
  console.log("ready");
  console.log(`
  ++++++++++++++++++++++++++++++++
  +  Mualim Dawah International  +
  ++++++++++++++++++++++++++++++++
  `)
  console.log("[*] Protector is watching now!");

  client.user.setPresence({
    activity: {
      name: "Listening to your Recitations!",
      type: 0,
    },
  });

  console.log(`\n
  ++++++++++++++++++++++++++++++++
  +           Commands           +
  ++++++++++++++++++++++++++++++++
  `)
  loadCommands(client);
  

});

client
  .on("debug", console.log)
  .on("warn", console.log)

client.login(config.Config.token);
