export interface IContemptTools {
    addAContempt(contemptCommand: IContempt): Promise<void>;
    getContemptCountForUser(discordUser: IDiscordUser): Promise<number>;
    getAllContempt():Promise<Map<IDiscordUser, number>>;
    convertInteractionToContempt(interaction): IContempt;
}

export interface IDiscordUser
{
    id: string;
    name: string;
}

export interface IContempt {
    guildId: String;
	target: IDiscordUser;
	sender: IDiscordUser;
	reason?: String;
	messageReason?: String;
}
