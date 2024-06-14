import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type Command from "../interfaces/Command";
import User from "../models/User";

export default {
    data: new SlashCommandBuilder()
        .setName("cooldown")
        .setDescription("Shows remaining rolls for a user."),

    async execute(interaction: CommandInteraction) {
        const user = await User.findOne({ discord_id: interaction.user.id });
        var rolls = 0;

        if (user) {
            rolls = user.rolls;
        }

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle("Rolls Remaining")
            .setDescription(
                `You have ${rolls} rolls remaining.`
            );

        await interaction.reply({
            embeds: [embed],
        });
    }
} as Command
