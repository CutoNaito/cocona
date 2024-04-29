import { Client, Events, GatewayIntentBits } from 'discord.js';
import help from './commands/help';
import { SeiyuuClient } from './client';

const client = new SeiyuuClient({
    intents: [GatewayIntentBits.Guilds],
}, [help]);

client.once(Events.ClientReady, (c) => {
    console.log(`Logged in as ${c.user?.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
