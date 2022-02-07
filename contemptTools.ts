import { IContemptDomain, IContempt, IDiscordUser } from './types';
import { newAddContempt, newGetContempt } from './contemptDBTools';

class ContemptDomainImpl implements IContemptDomain
{
    async addAContempt(contemptInfo: IContempt): Promise<void>
    {
        await newAddContempt(contemptInfo);
    }
    async getContemptCountForUser(discordUser: IDiscordUser): Promise<number>
    {
        return newGetContempt(discordUser);
    }
}

// exporting Singleton
export var ContemptTools = <IContemptDomain>new ContemptDomainImpl();