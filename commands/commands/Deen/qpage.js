const config = require('@data/config')
const Discord = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
	commands: ["qpage", "qp"],
	expectedArgs: "<surah> <ayah>",
	minArgs: 1,
	cooldown: 3,
	callback: async (message, arguments, text) => {
		const resp = await fetch(`https://api.alquran.cloud/ayah/${arguments[0]}:${arguments[1]}`)
		if (resp.status !== 200){
			message.channel.send("Invalid Arguments")
			return;
		}

		const json = await resp.json();
		const page = json.data.page.toString().padStart(3, "0");

		const image = `https://www.searchtruth.org/quran/images2/large/page-${page}.jpeg`;

		const embed = new Discord.MessageEmbed()
			.setTitle(`Page: ${page}\nAyah: ${arguments[1]}\nSurah: ${arguments[0]}.${json.data.surah.englishName} - ${json.data.surah.englishNameTranslation} ${json.data.surah.name}`)
			.setColor("#D4AF37")
			.setImage(image)

		message.channel.send(embed);
	}
}