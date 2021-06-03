const config = require("@data/config");
const credentials = require("@data/credentials");
const Discord = require("discord.js");
const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = {
    commands: ["leaderboard", "lb"],
	callback: async (message, arguments, text) => {
        const target = message.mentions.users.first() || message.author
		const id = target.id

		const doc = new GoogleSpreadsheet(config.Config.spreadSheetID);
		await doc.useServiceAccountAuth({
			client_email: credentials.client_email,
			private_key: credentials.private_key,
		  });
		
		await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        
        let data = []

        for (const row of rows) {
            data.push([
                row['ID'], 
                row['Name'], 
                row['Current Streak'], 
                row['Longest Streak'], 
                row['Total Days'],
                row['Last Updated']
            ])
        }
        
        data.sort(function (a, b){
            return b[2] - a[2];
        });

        const leaderboard = new Discord.MessageEmbed()
	    .setColor('#0099ff')
        .setURL("https://docs.google.com/spreadsheets/d/129PlRxoHVYjMHUXiieMT6_AQIiGq02QeXcBQe17qhN4/edit?usp=sharing")
	    .setTitle('Quran Club Leaderboard')
	    .setFooter('Quran Club,  Powered by Google Spreadsheet')
	    .setDescription('Here are the Top 10 Rankings:')

        for (var i = 0; i < 10 && i < rows.length; i ++) {
            leaderboard.addField(`${[i + 1]}. ${data[i][1]}`,`Current Streak: ${data[i][2]}, Longest Streak: ${data[i][3]}, Total Days: ${data[i][4]}`)
        }

        message.channel.send(leaderboard)

    }
}