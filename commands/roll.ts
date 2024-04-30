import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type Command from "../interfaces/Command";
import User from "../models/User";
import Seiyuu from "../models/Seiyuu";

export default {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Rolls a random seiyuu."),

    async execute(interaction: CommandInteraction) {
        const count = await Seiyuu.countDocuments();
        const randomSeiyuu = await Seiyuu.findOne().skip(Math.floor(Math.random() * count));

        if (!randomSeiyuu) {
            return interaction.reply("Something went wrong. Please try again.");
        }

        const embed = new EmbedBuilder()
            .setTitle(randomSeiyuu.name)
            .setDescription("Tatemae: " + randomSeiyuu.tatemae)
            .setImage(randomSeiyuu.picture)

        const claimButton = new ButtonBuilder()
            .setCustomId("claim")
            .setLabel("Claim")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(claimButton);

        const response = await interaction.reply({ 
            embeds: [embed],
            components: [row]
        });

        const collected = await response.awaitMessageComponent({
            filter: i => i.customId === "claim",
                time: 15000
        });

        if (collected.customId === "claim") {
            var user = await User.findOne({ discord_id: interaction.user.id });

            if (!user) {
                user = new User({
                    discord_id: interaction.user.id,
                    seiyuus: [randomSeiyuu._id]
                });

                await user.save();
            } else {
                user.seiyuus.push(randomSeiyuu._id);
                await user.save();
            }

            await interaction.editReply({
                embeds: [embed.setColor(Colors.Green)],
                components: []
            });
        }
    }
} as Command
