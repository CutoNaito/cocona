import type { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export default interface Command {
	data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    execute: (interaction: ChatInputCommandInteraction) => void;
}
