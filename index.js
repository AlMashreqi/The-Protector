require('module-alias/register')

const Discord = require("discord.js");
const client = new Discord.Client();
const keepAlive = require("@root/host.js");

const config = require("@data/config.json");
const loadCommands = require("@root/commands/load-commands")

client.on("ready", async () => {
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

keepAlive();
client.login(config.Config.token);
