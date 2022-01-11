const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');



/*
// Dumb Way of "Automatically" adding commands
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}*/

const commands =[
	new SlashCommandBuilder()
]


const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), 
		{ body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);