import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all of my commands or info about a specific command.'),

    async execute(interaction: CommandInteraction) {
        await interaction.reply('Help command');
    }
}
