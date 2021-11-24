const { UserContempt } = require('../loaddb.js');
const { SlashCommandBuilder } = require('@discordjs/builders');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('contempt')
		.setDescription('Hate Hate hate hate Hate!')
        .addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(true)),
        
	async execute(interaction) {
                
                //await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
                //await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
                const member = interaction.options.getMember('target');
                const name = member.nickname ?? member.user.username;

                const userContemptDocumentId = `${member.guild.id}/${member.user.id}`;
                console.log(`userContemptDocumentId: ${userContemptDocumentId}`);

                // let userContempt = UserContempt.findById(userContemptDocumentId).exec();
                let userContempt = await UserContempt.findOne({guildId: member.guild.id, userId: member.user.id}).exec();

                console.log(`userContemptfrom DB: ${userContempt}`);

                if (userContempt == null)
                {
                        console.log('new user!')

                        userContempt = new UserContempt();
                        userContempt.guildId = interaction.guild.id;
                        userContempt.userId = interaction.user.id;
                        userContempt.contemptCount = 0
                        userContempt.id = userContemptDocumentId;
                }
                userContempt.contemptCount = userContempt.contemptCount + 1;

                console.log(`contemptCount: ${userContempt.contemptCount}`)

                userContempt.save();

                await interaction.reply(`I hate you: ${name}! You have ${userContempt.contemptCount} contempts`);
	},
};