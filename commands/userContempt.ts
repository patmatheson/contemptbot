import { ContextMenuCommandBuilder } from "@discordjs/builders";
import * as discord from 'discord.js';

const command = {
    data: new ContextMenuCommandBuilder()
        .setName("Send Contempt"),

    async execute(interaction, client){
        if(interaction.isContextMenu){
            await SendContempt(interaction, client);
        }
    }
}

async function SendContempt (interaction, client){
    await SendContempt(interaction, client);
}

export {
    command
}