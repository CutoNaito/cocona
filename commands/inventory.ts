import { Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import User from "../models/User";
import type Command from "../interfaces/Command";

export default {
    data: new SlashCommandBuilder()
        .setName("tatemae")
        .setDescription("Shows your owned ammount of tatemae."),

    async execute(interaction: CommandInteraction) {
        const user = await User.findOne({ discord_id: interaction.user.id });

        if (!user) {
            await interaction.reply("You have to roll atleast once first.");
            return;
        }

        const embed = new EmbedBuilder()
            .setDescription(`${user.tatemae}:cherry_blossom:`)
            .setColor(Colors.Fuchsia);

        await interaction.reply({ embeds: [embed] });
    }
} as Command;
