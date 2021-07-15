const config = require("@data/config");
const credentials = require("@data/credentials");
const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = {
    commands: ["hifz", "hz"],
	expectedArgs: "<user>",
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
		today = new Date();
		for (const row of rows) {
			if (id === row.ID) {
				row['Name'] = target.username;
				updated_date = new Date(row['Last Updated'])
				if (today.getDate() == updated_date.getDate()) {
					row.save();
					message.reply("Habibi/Habibti, You have already done hifz for today, Come Back tomorrow.")
					return
				}
				if (today.getDate() - updated_date.getDate() >= 3) {
					row['Current Streak'] = 1;
				} else {
					row['Current Streak'] = parseInt(row['Current Streak']) + 1;
					
				}
				if (parseInt(row['Current Streak']) >= parseInt(row['Longest Streak'])) {
					row['Longest Streak'] = row['Current Streak'];
				}
				row['Total Days'] = parseInt(row['Total Days']) + 1;
				row['Last Updated'] = today;
				row.save()
				message.channel.send(
					`__**Updated The Profile:**__\n__**Name:**__ ${target.username}\n__**Current Streak:**__ ${row['Current Streak']}\n__**Longest Streak:**__ ${row['Longest Streak']}\n__**Total Days:**__ ${row['Total Days']}`
				)
				return
			}
		}
		
		const newAdd = await sheet.addRow({ 
			ID: target.id, 
			"Name": target.username,
			"Current Streak": 1,
			"Total Days": 1,
			"Longest Streak": 1,
			"Last Updated": today
		});

		await newAdd.save();

		message.channel.send(
			`Welcome To Quran Club, __**Added The Profile:**__\n__**Name:**__ ${target.username}\n__**Current Streak:**__ ${newAdd['Current Streak']}\n__**Longest Streak:**__ ${newAdd['Longest Streak']}\n__**Total Days:**__ ${newAdd['Total Days']}`
		)
		
	}
}