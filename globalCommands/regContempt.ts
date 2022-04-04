import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from 'discord-api-types/v9';
import * as fs from 'fs';
import { TEST_MODE, token, clientId } from "..";



const command = {
    data: new SlashCommandBuilder()
        .setName('regcontempt')
        .setDescription('Register Commands for ContemptBot on this Server'),

    async execute (interaction, client){
        const commandFiles = fs.readdirSync('../commands').filter(file => file.endsWith('.js'));
        
        const commands = [];
        
        for (const file of commandFiles){
            const guildCommands = require(`./${file}`);
            commands.push(guildCommands.data.toJSON());
        }

        const guildId = interaction.guild.id;

        if (!TEST_MODE){
            const rest = new REST({version: '9'}).setToken(token);
            try{
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: commands },
                )
            } catch (error){
                console.error(error);
            }
        }
    }
}

export async function regContempt (){
    const regCommand = [];
    regCommand.push(command.data.toJSON());

    const rest = new REST({version: '9'}).setToken(token);
    
    try{
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: regCommand },
        )
    } catch (error){
        console.error(error);
    }
}

export {
    command,
}
