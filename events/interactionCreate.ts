import { CommandInteraction, Events, SlashCommandBuilder } from "discord.js";
import type Event from "../interfaces/Event";

export default {
    name: Events.InteractionCreate,
	
	execute: async (interaction: CommandInteraction) => {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
} as Event;