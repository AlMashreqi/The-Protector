const config = require('@data/config');
const Discord = require("discord.js");
const fetch = require('node-fetch');

const prefix = config.Config.prefix
module.exports = {
    commands: ["help", "h"],
	callback: async (message, arguments, text) => {
        const target = message.mentions.users.first() || message.author
		const id = target.id
        const helped = new Discord.MessageEmbed()
	    .setColor('#36393E')
        .setURL("https://docs.google.com/spreadsheets/d/129PlRxoHVYjMHUXiieMT6_AQIiGq02QeXcBQe17qhN4/edit?usp=sharing")
	    .setTitle('Hafiz Bot Commands')
	    .setFooter('Quran Club,  Powered by Google Spreadsheet')
	    .setDescription('Hey I am Hafiz (The Protector). I remember your daily Hifz Progress.\nHere are all the commands:')
        .addFields(
            { name: `${prefix}qpage <juz> <surah>`, value: 'Displays the Mushaf for given reference.' },
            { name: `${prefix}hifz [user]`, value: 'Your Daily Hifz Check-in' },
            { name: `${prefix}leaderboard`, value: 'Displays the Top 10 standings' },
            { name: `${prefix}profile [user]`, value: 'Displays your Hifz Profile' },
        )

        message.channel.send(helped)
    }
}