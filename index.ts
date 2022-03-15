import { connectDb } from './contemptDBTools';
import * as fs from 'fs';
import { Client, Collection, Intents } from 'discord.js';
import * as contemptCommand from './commands/contempt';
import * as userCommand from './commands/userContempt';
import { regContempt } from './globalCommands/regContempt';
import { aliveProbe } from './util';

const TEST_MODE: boolean = true;

aliveProbe();

let token: string, clientId: string;

if (TEST_MODE){
	const config = require('./config.json');
	token = config.token;
	clientId = config.clientId;
} else {
	token = process.env.DISCORD_BOT_TOKEN;
	clientId = process.env.DISCORD_BOT_ID;
}


const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS] });


regContempt();

const commands:any = new Collection();

commands.set(contemptCommand.command.data.name, contemptCommand.command);
commands.set(userCommand.command.data.name, userCommand.command);


// When the client is ready, connect to db
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
		await command.execute(interaction, client);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(token);

export{
	token,
	clientId,
	TEST_MODE
}