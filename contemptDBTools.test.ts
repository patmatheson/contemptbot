import { Client, Intents, Interaction, CommandInteraction } from 'discord.js';
//import { token, clientId, testChannelId } from './config.json';
import * as contemptDBTools from './contemptDBTools';
//import { DiscordTools } from './discordTools';

let count = 0;

let dbConnection;

beforeAll( async () => {
    dbConnection = await contemptDBTools.connectDb(true);
    //await contemptClient.login(token);
    //testChannel = await contemptClient.channels.fetch(testChannelId);
});

test('add contempt to database test', async() => {
    let testContempt = { 
        guildId: "001",
        target: { id: "002", name: "pat"},
        sender: { id: "003", name: "testpat"}
    }
    
    await contemptDBTools.newAddContempt(testContempt);
    let result = await contemptDBTools.newGetContempt(testContempt.target);

    expect(result).toBe(1);
});


test('open database connection to mongo', () => {
    expect(1+2).toBe(3);
});

afterAll( async () => {
    dbConnection.dbClose();
});