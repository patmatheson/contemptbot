import { UserContempt, getContempts, addContempt, GuildContempt } from '../contemptDBTools.js';
import { SlashCommandBuilder } from '@discordjs/builders';

function addDays(date, days) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

const command = {
	data: new SlashCommandBuilder()
		.setName('contempt')
		.setDescription('Hate Hate hate hate Hate!')
		.addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(true)),

	async execute(interaction) {
		//check subcommand menu, subcommands

		if (interaction.options.getSubcommandGroup(false) == 'send'){
			if (interaction.options.getSubcommand(false) == 'user') {
				console.log (`SubcommandGroup :${interaction.options.getSubcommandGroup(false)}`);
				console.log (`Subcommand ${interaction.options.getSubcommand(false)}`);
				await sendContempt(interaction);
			}
			else if (interaction.options.getSubcommand(false) == 'scorn') {
				console.log (`SubcommandGroup :${interaction.options.getSubcommandGroup(false)}`);
				console.log (`Subcommand ${interaction.options.getSubcommand(false)}`);
				// Send Scorn TODO
			}

		}
	},


}
async function sendContempt ( interaction) {
		// get target member information from message interaction.  Uses options to get target, not sender
		const member = interaction.options.getMember('user');
		// if member has a nickname on this server get that, otherwise get the member name
		const name = member.guild.nickname ?? member.user.username;

		// assign the combination of guild/user id for DB id number, so each user is tracked per guild
		const userContemptDocumentId = `${member.guild.id}/${member.user.id}`;
		console.log (`userContemptDocumentId: ${userContemptDocumentId}`);

		const guildContempt = await GuildContempt.findGuildOrDefault(member.guild.id);
		console.log(`guildContempt settings from DB: ${guildContempt}`);
	

		// check the database for documents that match both the guild and member id.
		let userContempt = await UserContempt.findOne({ guildID: member.guild.id, userId: member.user.id }).exec();
		console.log(`userContemptfrom DB: ${userContempt}`);

		// Create new document if none exists for this guild/user
		if (userContempt == null) {
			console.log('new user!');

			userContempt = new UserContempt();
			userContempt.guildId = interaction.guild.id;
			userContempt.userId = interaction.user.id;
			userContempt.id = userContemptDocumentId;
		}

		userContempt.addContempt();

		await userContempt.save();
		
		let totalContempts = await userContempt.getContempts(guildContempt);
		console.log(`contemptCount: ${totalContempts}`);

		// get the bot to send a message so you know it hates the target too.
		await interaction.reply(`I hate you: ${name}! You have ${totalContempts} contempts`);
		console.log('this is a breakpoint');
}


export {
	command,
};