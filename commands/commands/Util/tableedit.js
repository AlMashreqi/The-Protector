const config = require("@data/config");
const credentials = require("@data/credentials");
const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = {
    commands: ["tableedit", "te"],
	expectedArgs: "<user> <current streak> <longest streak> <total days>",
	callback: async (message, arguments, text) => {
        if(message.author.id !== '352113417848487948' && message.author.id !== '777202501283610624') return;
		const target = message.mentions.users.first() || message.author
		const id = target.id

        const cs = arguments[1]
        const ls = arguments[2]
        const td = arguments[3]

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
				row['Current Streak'] = cs;
				row['Longest Streak'] = ls;
				row['Total Days'] = td;
				row.save()
				message.channel.send(
					`__**Updated The Profile:**__\n__**Name:**__ ${target.username}\n__**Current Streak:**__ ${row['Current Streak']}\n__**Longest Streak:**__ ${row['Longest Streak']}\n__**Total Days:**__ ${row['Total Days']}`
				)
				return
			}
		}
		
	}
}