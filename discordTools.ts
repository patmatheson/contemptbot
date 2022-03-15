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

    async showContempt(interaction: any, client: any): Promise<void> 
    {
    	const contemptToGet = ContemptTools.convertInteractionToContempt(interaction);
	    let numContempts = await ContemptTools.getContemptCountForUser(contemptToGet.target);
        
        let TargetName = this.getUserNameFromID(client, contemptToGet.target.id)

        if (numContempts == 0){
            console.log(`User ${TargetName} not found`);
            await interaction.reply(`${TargetName} has no contempt (for now).`);
            return;
        }
        
        console.log(`~~User ${TargetName} has ${numContempts}.~~`);
        await interaction.reply(`${TargetName} has ${numContempts} contempts.`);
    }
}

export var DiscordTools = <IDiscordTools>new DiscordToolsImpl();
