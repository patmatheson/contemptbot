const loaddb = require('../loaddb.js');
const { SlashCommandBuilder } = require('@discordjs/builders');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('contempt')
		.setDescription('Hate Hate hate hate Hate!')
        .addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(true)),
        
	async execute(interaction) {
        db = loaddb.getdbconn();
        //await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
        //await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
        const member = interaction.options.getMember('target');
        const name = member.nickname ?? member.user.username;
        
        await interaction.reply(`I hate you: ${name}!`);
	},
};