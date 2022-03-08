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
}

export var DiscordTools = <IDiscordTools>new DiscordToolsImpl();
