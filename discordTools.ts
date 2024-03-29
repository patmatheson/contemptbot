import { SystemChannelFlags } from 'discord.js';
import { ContemptTools } from './contemptTools';
import { IDiscordTools } from './types';

class DiscordToolsImpl implements IDiscordTools{
    
    
    async getUserNameFromID(client, userId: string): Promise<string>
    {
        let user;
        try {
            user = await client.users.fetch(userId);
        } catch (e) {
            return `Error: ${e.message}`;
        }
        if (!user){
            return 'General Hatred';
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
        
        let TargetName = await this.getUserNameFromID(client, contemptToGet.target.id)

        if (numContempts == 0){
            console.log(`User ${TargetName} not found`);
            await interaction.reply(`${TargetName} has no contempt (for now).`);
            return;
        }
        
        console.log(`~~User ${TargetName} has ${numContempts}.~~`);
        await interaction.reply(`${TargetName} has ${numContempts} contempts.`);
    }

    async listAllContempt(interaction: any, client: any): Promise<void> {
        await interaction.reply({content: `Fetching all contempts sent...`, ephemeral: true} );
	
        const allContempts = await ContemptTools.getAllContempt();
        
        if (!allContempts){
            await interaction.followUp(`No Contempts were found. You're are not hateful enough`);
            return;
        }
    
        let outputString = "I hate you all this much: \n";
        for (const [key, value] of allContempts.entries()){
            let name = await this.getUserNameFromID(client, key);
            outputString = outputString + `${name}: ${value} Contempts \n`;
        }
        console.log(outputString);
    
        await interaction.followUp(outputString);
    }

}

export var DiscordTools = <IDiscordTools>new DiscordToolsImpl();
