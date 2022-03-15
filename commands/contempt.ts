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
					await newShowContempt(interaction);
				}
				else if (interaction.options.getSubcommand(false) == 'all') {
					console.log (`SubcommandGroup :${interaction.options.getSubcommandGroup(false)}`);
					console.log (`Subcommand ${interaction.options.getSubcommand(false)}`);
					//await listAllContempts(interaction);
					await newListAllContempts(interaction, client);
				}
			}
		}
		else if (interaction.isContextMenu()){
			if (interaction.commandName == 'Send Contempt'){
				console.log (`Context Command ${interaction.commandName} selected...`);
				await oldSendContempt(interaction);
			}
		}
	},
}

async function newSendContempt(interaction, client): Promise<void>
{
	const contemptToSend = ContemptTools.convertInteractionToContempt(interaction);
	ContemptTools.addAContempt(contemptToSend);
	let foundName = await DiscordTools.getUserNameFromID(client, contemptToSend.target.id);
	let numContempts = await ContemptTools.getContemptCountForUser(contemptToSend.target);
	await interaction.reply(`I hate you so much, ${foundName}!  You have ${numContempts} contempt!`);
}

async function newShowContempt(interaction): Promise<void>
{
	const contemptToGet = ContemptTools.convertInteractionToContempt(interaction);
	let numContempts = await ContemptTools.getContemptCountForUser(contemptToGet.target);
	
	if (numContempts == 0){
		console.log(`User ${contemptToGet.target.name} not found`);
		await interaction.reply(`${contemptToGet.target.name} has no contempt (for now).`);
		return;
	}
	
	console.log(`~~User ${contemptToGet.target.name} has ${numContempts}.~~`);
	await interaction.reply(`${contemptToGet.target.name} has ${numContempts} contempts.`);
}

async function oldSendContempt ( interaction ) {
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
			userContempt.userId = member.user.id;
			userContempt.userName = name;
			userContempt.id = userContemptDocumentId;
		}

		userContempt.addContempt();

		await userContempt.save();
		
		let totalContempts = await userContempt.getContempts(guildContempt);
		console.log(`contemptCount: ${totalContempts}`);

		// get the bot to send a message so you know it hates the target too.
		await interaction.reply(`I hate you: ${name}! You have ${totalContempts} contempts`);
}

//this is very close to sendContempt, consider making these 1 function with variable to determine send/receive
async function showContempt ( interaction) {
	// get target member information from message interaction.  Uses options to get target, not sender
	const member = interaction.options.getMember('user');
	// if member has a nickname on this server get that, otherwise get the member name
	const name = member.guild.nickname ?? member.user.username;

	const userContemptDocumentId = `${member.guild.id}/${member.user.id}`;
	console.log (`userContemptDocumentId: ${userContemptDocumentId}`);

	const guildContempt = await GuildContempt.findGuildOrDefault(member.guild.id);
	console.log(`guildContempt settings from DB: ${guildContempt}`);

	// check the database for documents that match both the guild and member id.
	let userContempt = await UserContempt.findOne({ guildID: member.guild.id, userId: member.user.id }).exec();
	console.log(`userContemptfrom DB: ${userContempt}`);

	if (userContempt == null) {
		console.log(`User ${name} not found`);
		await interaction.reply(`${name} has no contempt (for now).`);
		return;
	}

	let totalContempts = await userContempt.getContempts(guildContempt);
	console.log(`contemptCount: ${totalContempts}`);
	await interaction.reply(`${name} has ${totalContempts} contempts.  I hate them so much.`);
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

//need to change this to just show 1 guild contempts.
async function listAllContempts (interaction) {

	const guildContempt = await GuildContempt.findGuildOrDefault(interaction.member.guild.id);
	console.log(`guildContempt settings from DB: ${guildContempt}`);

	await interaction.reply({content: `Fetching all contempts sent...`, ephemeral: true} );

	let userContempt = await UserContempt.findOne({});
	let allContempt = await userContempt.getAllContempts(guildContempt);

	let outputString = "I hate you all this much: \n";
	for (const [key, value] of allContempt.entries()){
		outputString = outputString + `${key}: ${value} Contempts \n`;
	}
	console.log(outputString);

	await interaction.followUp(outputString);


	
}


export {
	command,
};