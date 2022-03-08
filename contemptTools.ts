import { IContemptTools, IContempt, IDiscordUser } from './types';
import { newAddContempt, newGetContempt, newGetAllContempts } from './contemptDBTools';

class ContemptDomainImpl implements IContemptTools
{
    async addAContempt(contemptInfo: IContempt): Promise<void>
    {
        await newAddContempt(contemptInfo);
    }
    async getContemptCountForUser(discordUser: IDiscordUser): Promise<number>
    {
        return await newGetContempt(discordUser);
    }
    async getAllContempt(): Promise<Map<string, number>>
    {   
        return newGetAllContempts();
    }
    convertInteractionToContempt (interaction) : IContempt
    {
        const target = interaction.options.getMember('user');
        // if member has a nickname on this server get that, otherwise get the member name
        const targetName = target.guild.nickname ?? target.user.username;
        const senderName = interaction.user.nickname ?? interaction.user.username;
        return { 
            guildId: target.guild.id,
            target: { id: target.user.id, name: targetName},
            sender: { id: interaction.user.id, name: senderName }
        };
    }
}

// exporting Singleton
export var ContemptTools = <IContemptTools>new ContemptDomainImpl();