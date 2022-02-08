import { ContextMenuCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import { ContemptTools } from "../contemptTools";


const command = {
	data: new ContextMenuCommandBuilder()
		.setName('contextContempt')
		.setType(2),

    async execute(interaction: Interaction): Promise<void> {
        await ContemptTools.addAContempt(ContemptTools.convertInteractionToContempt(interaction));
        
    }
}