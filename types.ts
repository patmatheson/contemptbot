export interface IContemptDomain {
    addAContempt(contemptCommand: IContempt): Promise<void>;
    getContemptCountForUser(discordUser: IDiscordUser): Promise<number>;
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
