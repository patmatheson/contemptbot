const { UserContempt } = require('../loaddb.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('contempt')
		.setDescription('Hate Hate hate hate Hate!')
		// testing comments
		.addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(true)),

	async execute(interaction) {
		// get target member information from message interaction.  Uses options to get target, not sender
		const member = interaction.options.getMember('target');
		// if member has a nickname on this server get that, otherwise get the member name
		const name = member.nickname ?? member.user.username;

		// assign the combination of guild/user id for DB id number, so each user is tracked per guild
		const userContemptDocumentId = `${member.guild.id}/${member.user.id}`;
		console.log (`userContemptDocumentId: ${userContemptDocumentId}`);

		// let userContempt = UserContempt.findById(userContemptDocumentId).exec();

		// check the database for documents that match both the guild and member id.
		let userContempt = await UserContempt.findOne({ guildID: member.guild.id, userId: member.user.id }).exec();
		console.log(`userContemptfrom DB: ${userContempt}`);

		// Create new document if none exists for this guild/user
		// someother comment
		if (userContempt == null) {
			console.log('new user!');

			userContempt = new UserContempt();
			userContempt.guildId = interaction.guild.id;
			userContempt.userId = interaction.user.id;
			userContempt.contemptCount = 0;
			userContempt.id = userContemptDocumentId;
		}


		userContempt.contemptCount = userContempt.contemptCount + 1;
		console.log(`contemptCount: ${userContempt.contemptCount}`);

		// save user to database with updated contempt count
		userContempt.save();

		// get the bot to send a message so you know it hates the target too.
		await interaction.reply(`I hate you: ${name}! You have ${userContempt.contemptCount} contempts`);

	},
};