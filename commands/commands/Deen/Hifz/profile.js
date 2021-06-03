const config = require("@data/config");
const credentials = require("@data/credentials");
const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = {
    commands: ["profile", "pf"],
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
        for (const row of rows) {
            if (id === row.ID) {
                message.reply(`${row['Name']}'s Profile:\n__**Current Streak:**__ ${row['Current Streak']}\n__**Longest Streak:**__ ${row['Longest Streak']}\n__**Total Days:**__ ${row['Total Days']}\n__**Last Updated:**__ ${row['Last Updated']}`)
                return
            }
        }
        message.reply("Sorry, Couldn't Find it.")
    }
}