export interface IContemptTools {
    addAContempt(contemptCommand: IContempt): Promise<void>;
    getContemptCountForUser(discordUser: IDiscordUser): Promise<number>;
    getAllContempt():Promise<Map<string, number>>;
    convertInteractionToContempt(interaction): IContempt;
}

export interface IDiscordTools{
    getUserNameFromID(client, UserId: string): Promise<string>;
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
