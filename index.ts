import { Client, Events, GatewayIntentBits } from 'discord.js';
import help from './commands/help';
import addSeiyuu from './commands/addSeiyuu';
import { SeiyuuClient } from './client';
import interactionCreate from './events/interactionCreate';
import ready from './events/ready';
import { connect } from 'mongoose';
import colors from 'colors/safe';
import roll from './commands/roll';
import viewClaimed from './commands/viewClaimed';
import dump from './commands/dump';
import wish from './commands/wish';
import viewWished from './commands/viewWished';
import User from './models/User';
import cooldown from './commands/cooldown';

if (!process.env.DISCORD_TOKEN) {
	console.error('No token provided');
	process.exit(1);
}

if (!process.env.MONGO_URI) {
	console.error('No MongoDB URI provided');
	process.exit(1);
}

export const commands = [help, roll, addSeiyuu, viewClaimed, dump, wish, viewWished, cooldown];
const events = [ready, interactionCreate];

const client = new SeiyuuClient({
    intents: [GatewayIntentBits.Guilds],
}, commands, events);

connect(process.env.MONGO_URI)
	.then(() => {
		console.log(colors.cyan('Connected to MongoDB'));
		client.login(process.env.DISCORD_TOKEN);
	})
	.catch((err) => {
		console.error(err);
	});

client.on(Events.ClientReady, () => {
    setInterval(() => {
        var Users = User.find();
        // set all users' rolls to 10
        Users.then((users) => {
            users.forEach((user) => {
                user.rolls = 10;
                user.can_claim = true;
                user.save();
            })
        })
    }, 1000 * 60 * 60);
})
