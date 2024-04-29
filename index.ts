import { Client, Events, GatewayIntentBits } from 'discord.js';
import help from './commands/help';
import { SeiyuuClient } from './client';
import interactionCreate from './events/interactionCreate';
import ready from './events/ready';
import { connect } from 'mongoose';
import colors from 'colors/safe';

if (!process.env.DISCORD_TOKEN) {
	console.error('No token provided');
	process.exit(1);
}

if (!process.env.MONGO_URI) {
	console.error('No MongoDB URI provided');
	process.exit(1);
}

export const commands = [help];
const events = [ready, interactionCreate];

const client = new SeiyuuClient({
    intents: [GatewayIntentBits.Guilds],
}, commands, events);

client.once(Events.ClientReady, (c) => {
    console.log(`Logged in as ${c.user?.tag}`);
});

connect(process.env.MONGO_URI)
	.then(() => {
		console.log(colors.cyan('Connected to MongoDB'));
		client.login(process.env.DISCORD_TOKEN);
	})
	.catch((err) => {
		console.error(err);
	});