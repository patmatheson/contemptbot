import { ContemptTools } from './contemptTools';
import { IDiscordTools } from './types';

class DiscordToolsImpl implements IDiscordTools{
    async getUserNameFromID(client, userId: string): Promise<string>
    {
        let user = await client.users.cache.get(userId);
        if (!user){
            return 'Unknown User';
        }
        return user.username;
    }

    async sendContempt(interaction: any, client: any): Promise<void>
    {
        const contemptToSend = ContemptTools.convertInteractionToContempt(interaction);
        
        ContemptTools.addAContempt(contemptToSend);

        let foundName = await this.getUserNameFromID(client, contemptToSend.target.id);
        let numContempts = await ContemptTools.getContemptCountForUser(contemptToSend.target);
        
        await interaction.reply(`I hate you so much, ${foundName}!  You have ${numContempts} contempt!`);
    }
}

export var DiscordTools = <IDiscordTools>new DiscordToolsImpl();
