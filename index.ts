import { connectDb } from './contemptDBTools';
import * as fs from 'fs';
import { Client, Collection, Intents } from 'discord.js';
//import { token } from './config.json';
import * as contemptCommand from './commands/contempt';
import * as process from 'process';

var http = require('http');

http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
  resp.on('data', function(ip) {
    console.log("My public IP address is: " + ip);
  });
});


const token = process.env.DISCORD_BOT_TOKEN;
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commands:any = new Collection();
// add little change
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

commands.set(contemptCommand.command.data.name, contemptCommand.command);
commands.set("Send Contempt", contemptCommand.command);


// When the client is ready, run this code (only once)
client.once('ready', async () => {
	console.log('DB Preparing!');
	await connectDb();
	console.log('DB Prepared!');
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	
	if ((interaction.type=="APPLICATION_COMMAND")) console.log("Application command");
	
	if (!(interaction.isApplicationCommand())) return;

	const command = commands.get(interaction.commandName);


	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(token);