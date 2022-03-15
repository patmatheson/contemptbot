import { UserContempt, getContempts, addContempt, GuildContempt, newGetAllContempts } from '../contemptDBTools.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { DiscordAPIError } from 'discord.js';
import { DiscordTools } from '../discordTools';
import { ContemptTools } from '../contemptTools';


const command = {
	data: new SlashCommandBuilder()
		.setName('contempt')
		.addSubcommandGroup(subCommandGroup => 
			subCommandGroup
				.setName("send")
				.setDescription("Sending Contempt")
				.addSubcommand(subcommand =>
					subcommand
						.setName("user")
						.setDescription("Send Contempt to a User")
						.addUserOption(option =>
							option
								.setName("user")
								.setDescription("Send Contempt to this User")
								.setRequired(true))))
		.addSubcommandGroup(subCommandGroup =>
			subCommandGroup
				.setName("list")
				.setDescription("see how much contempt is out there")
				.addSubcommand(subcommand =>
					subcommand
						.setName("user")
						.setDescription("See how much contempt a user has")
						.addUserOption(option =>
							option
								.setName("user")
								.setDescription("See how much contempt this user has")))
				.addSubcommand(subcommand =>
					subcommand
						.setName("all")
						.setDescription("See how much contempt everyone has"))),

	async execute(interaction, client): Promise<void> {
		//check subcommand menu, subcommands
		if(interaction.isCommand()) {
			if (interaction.options.getSubcommandGroup(false) == 'send'){
				if (interaction.options.getSubcommand(false) == 'user') {
					console.log (`SubcommandGroup :${interaction.options.getSubcommandGroup(false)}`);
					console.log (`Subcommand ${interaction.options.getSubcommand(false)}`);
					
					//await sendContempt(interaction);
					//await newSendContempt(interaction, client);
					await DiscordTools.sendContempt(interaction, client);
				}
				else if (interaction.options.getSubcommand(false) == 'scorn') {
					console.log (`SubcommandGroup :${interaction.options.getSubcommandGroup(false)}`);
					console.log (`Subcommand ${interaction.options.getSubcommand(false)}`);
					// Send Scorn TODO
				}

			}
			else if (interaction.options.getSubcommandGroup(false) == 'list'){
				if (interaction.options.getSubcommand(false) == 'user') {
					console.log (`SubcommandGroup ${interaction.options.getSubcommandGroup(false)}`);
					console.log (`Subcommand ${interaction.options.getSubcommand(false)}`);
					//await showContempt(interaction);
					//await newShowContempt(interaction);
					await DiscordTools.showContempt(interaction, client);
				}
				else if (interaction.options.getSubcommand(false) == 'all') {
					console.log (`SubcommandGroup :${interaction.options.getSubcommandGroup(false)}`);
					console.log (`Subcommand ${interaction.options.getSubcommand(false)}`);
					//await listAllContempts(interaction);
					await newListAllContempts(interaction, client);
				}
			}
		}
	},
}

async function newListAllContempts (interaction, client){
	await interaction.reply({content: `Fetching all contempts sent...`, ephemeral: true} );
	
	const allContempts = await ContemptTools.getAllContempt();
	
	if (!allContempts){
		await interaction.followUp(`No Contempts were found. You're are not hateful enough`);
		return;
	}

	let outputString = "I hate you all this much: \n";
	for (const [key, value] of allContempts.entries()){
		let name = await DiscordTools.getUserNameFromID(client, key);
		outputString = outputString + `${name}: ${value} Contempts \n`;
	}
	console.log(outputString);

	await interaction.followUp(outputString);
}

export {
	command,
};