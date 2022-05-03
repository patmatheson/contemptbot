import { SlashCommandBuilder } from '@discordjs/builders';
import { DiscordTools } from '../discordTools';


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
								.setRequired(true)))
				.addSubcommand(subcommand =>
					subcommand
						.setName("reason")
						.setDescription("Send a contempt with a reason.")
						.addUserOption(option =>
							option
								.setName("user")
								.setDescription("Send Contempt to this user")
								.setRequired(true))
						.addUserOption(option =>
							option
								.setName("reason")
								.setDescription("Send Contempt for this reason")
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
				else if (interaction.options.getSubcommand(false) == 'reason') {
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
					//await newListAllContempts(interaction, client);
					await DiscordTools.listAllContempt(interaction, client);
				}
			}
		}
	}
}

export {
	command,
};