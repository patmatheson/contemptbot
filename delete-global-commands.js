const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');


const rest = new REST({ version: '9' }).setToken(token);

rest.get(Routes.applicationCommands(clientId))
	.then(data => {
		const promises = [];
		for (const command of data){
			const deleteURL = `${Routes.applicationCommands(clientId)}/${command.id}`;
			promises.push(rest.delete(deleteURL));
		}
		return Promise.all(promises);
	})
	.catch(console.log);