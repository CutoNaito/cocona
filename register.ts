import colors from "colors/safe";
import { REST, Routes, type RESTPutAPIApplicationCommandsResult } from "discord.js";
import { commands } from ".";

if (!process.env.DISCORD_TOKEN) {
	console.error('No token provided');
	process.exit(1);
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(colors.cyan(`Started refreshing ${commands.length} application (/) commands.`));
		
		if (!process.env.CLIENT_ID) {
			console.error('No client ID provided');
			process.exit(1);
		}

		if (!process.env.GUILD_ID) {
			console.error('No guild ID provided');
			process.exit(1);
		}

		// The put method is used to fully refresh all commands in the guild with the current set
		const data: RESTPutAPIApplicationCommandsResult[] = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
			{ body: commands },
		) as RESTPutAPIApplicationCommandsResult[];

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();