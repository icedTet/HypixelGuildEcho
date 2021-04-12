require("dotenv").config();
const mc = require('minecraft-protocol');
const fetch = require("node-fetch");
const messages = require("./config");

console.log({
	host: "hypixel.net",   // optional
	port: 25565,         // optional
	username: process.env.account_email,
	password: process.env.account_password,
	auth: "mojang" // optional; by default uses mojang, if using a microsoft account, set to 'microsoft'
});
const client = mc.createClient({
	host: "hypixel.net",   // optional
	port: 25565,         // optional
	username: process.env.account_email,
	password: process.env.account_password,
	auth: "mojang" // optional; by default uses mojang, if using a microsoft account, set to 'microsoft'
});
client.on("session", () => {
	let embed ={
		"content": "**Now Listening to Hypixel Guild Messages!!!**",
		"embeds": [
			{
				"title": "Bot Info",
				"description": "Designed by [Tet](https://tet.moe). Get a copy of this bot on [Github](https://github.com/icedTet/HypixelGuildEcho) Enjoy! Commissioned by Axilotl#5827",
				"color": null
			  },
		],
		"username": "Discord-Hypixel Link",
		"avatar_url": `https://www.mc-heads.net/avatar/degenetet`
	};
	fetch(process.env.webhook_url, {
		method: 'post',
		body: JSON.stringify(embed),
		headers: { 'Content-Type': 'application/json' },
	})
})
let exited = false;
let doExit = async ()=>{
	if (exited) return;
	exited = true;
	console.log("Goodbye!")
	let embed ={
		"content": "**No Longer Listening to Hypixel Guild Messages(Shutting Down)!!!**",
		"embeds": [
			{
				"title": "Bot Info",
				"description": "Designed by [Tet](https://tet.moe). Get a copy of this bot on [Github](https://github.com/icedTet/HypixelGuildEcho) Enjoy! Commissioned by Axilotl#5827",
				"color": null
			  },
		],
		"username": "Discord-Hypixel Link",
		"avatar_url": `https://www.mc-heads.net/avatar/degenetet`
	};
	await fetch(process.env.webhook_url, {
		method: 'post',
		body: JSON.stringify(embed),
		headers: { 'Content-Type': 'application/json' },
	});
	process.exit(0);
}
process.on("exit",doExit);
process.on('SIGINT', doExit);
client.on("error", (er) => {
	console.trace(er);
})
client.on('chat', (packet) => {
	const jsonMsg = JSON.parse(packet.message);
	if (jsonMsg.text && jsonMsg.text === "Guild > ") {
		let user = jsonMsg.extra[0].text;
		let action = jsonMsg.extra[1].text;
		let embed = action === "joined." ? {
			"content": null,
			"embeds": [
				{
					"title": messages.joinMessage,
					"color": null
				}
			],
			"username": user,
			"avatar_url": `https://www.mc-heads.net/avatar/${user}`
		} : {
			"content": null,
			"embeds": [
				{
					"title": messages.leaveMessage,
					"color": null
				}
			],
			"username": user,
			"avatar_url": `https://www.mc-heads.net/avatar/${user}`
		};
		fetch(process.env.webhook_url, {
			method: 'post',
			body: JSON.stringify(embed),
			headers: { 'Content-Type': 'application/json' },
		})
	} else if (jsonMsg.extra && jsonMsg.extra[0] && jsonMsg.extra[0].text && jsonMsg.extra[0].text.startsWith("§2Guild > ")) {

		let user = jsonMsg.extra[0].text.substring(9, jsonMsg.extra[0].text.length - 4).replace(/§.|:/g, "");
		//§2Guild > §6[MVP§d++§6] ignAxilotl§f: '
		let username = jsonMsg.extra[0].text.split(" ")[3].split("§")[0];
		let embed = {
			"content": messages.allowPings ? jsonMsg.extra[1].text : jsonMsg.extra[1].text.replace(/@/g, "@."),
			"embeds": null,
			"username": `${messages.prefix}${user}`,
			"avatar_url": `https://www.mc-heads.net/avatar/${username}`
		}
		console.log(embed);
		fetch(process.env.webhook_url, {
			method: 'post',
			body: JSON.stringify(embed),
			headers: { 'Content-Type': 'application/json' },
		})
	}
});