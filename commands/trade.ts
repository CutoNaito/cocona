import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type Command from "../interfaces/Command";
import User from "../models/User";
import Seiyuu from "../models/Seiyuu";
import Servers from "../models/Servers";
import { type Claim } from "../models/Servers";

export default {
    data: new SlashCommandBuilder()
        .setName("trade")
        .setDescription("Trade a seiyuu with a different user.")
        .addStringOption(option =>
            option.setName("user")
                .setDescription("Username of the user you want to trade with.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("your_seiyuu")
                .setDescription("Name of the seiyuu you want to trade.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("their_seiyuu")
                .setDescription("Name of the seiyuu you want to trade with.")
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user_name = interaction.options.getString("user") as string;
            const your_seiyuu_name = interaction.options.getString("your_seiyuu") as string;
            const their_seiyuu_name = interaction.options.getString("their_seiyuu") as string;

            const user = await User.findOne({ discord_id: interaction.user.id });
            const other_user = await User.findOne({ username: user_name });
            const your_seiyuu = await Seiyuu.findOne({ name: your_seiyuu_name });
            const their_seiyuu = await Seiyuu.findOne({ name: their_seiyuu_name });

            if (!user || !other_user || !your_seiyuu || !their_seiyuu) {
                interaction.reply({
                    content: "Invalid seiyuu name or invalid user or something went wrong.",
                });

                return;
            };

            const server = await Servers.findOne({ server_id: interaction.guildId });

            if (!server) {
                interaction.reply({
                    content: "An error occurred while trying to fetch the server.",
                });

            return;
            };

            const your_claimed = server.claims.find((claim: Claim) => claim.seiyuu.toString() === your_seiyuu._id.toString());
            const their_claimed = server.claims.find((claim: Claim) => claim.seiyuu.toString() === their_seiyuu._id.toString());

            if (!your_claimed || !their_claimed) {
                interaction.reply({
                    content: "One of the seiyuus are not claimed.",
                });

                return;
            }

            if (your_claimed.user.toString() !== user._id.toString()) {
                interaction.reply({
                    content: "You do not own the seiyuu you want to trade.",
                });

                return;
            }

            if (their_claimed.user.toString() !== other_user._id.toString()) {
                interaction.reply({
                    content: "The user does not own the seiyuu they want to trade.",
                });

                return;
            }

            const embed = new EmbedBuilder()
                .setColor(Colors.Grey)
                .setTitle("Trade")
                .setDescription(`Are you sure you want to trade **${your_seiyuu.name}** with **${their_seiyuu.name}**?\n\n`)

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("yes")
                        .setLabel("Yes")
                        .setStyle(ButtonStyle.Primary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("no")
                        .setLabel("No")
                        .setStyle(ButtonStyle.Danger)
                );

            const response = await interaction.reply({
                embeds: [embed],
                components: [row]
            });

            try {
                const trade = await response.awaitMessageComponent({
                    filter: i => i.customId === "yes" || i.customId === "no",
                        time: 60000
                });

                var interaction_user = await User.findOne({ discord_id: trade.user.id });

                if (trade.customId == "yes") {
                    if (interaction_user && interaction_user._id.toString() == other_user._id.toString()) {
                        your_claimed.seiyuu = their_seiyuu._id;
                        their_claimed.seiyuu = your_seiyuu._id;

                        await server.save();

                        await response.edit({
                            content: "Trade successful.",
                            components: []
                        });
                    } else {
                        await interaction.followUp({
                            content: "You are not the user the trade is meant for.",
                            ephemeral: true
                        });
                    }
                }

                if (trade.customId == "no") {
                    if (interaction_user && interaction_user._id.toString() == other_user._id.toString()) {
                        await response.edit({
                            content: "Trade cancelled.",
                            components: []
                        });

                        return;
                    } else {
                        await interaction.followUp({
                            content: "You are not the user the trade is meant for.",
                            ephemeral: true
                        });
                    }
                }
            } catch (err) {
                console.error(err);
                interaction.reply({
                    content: "An error occurred while trying to trade the seiyuu.",
                });
            }

        } catch (err) {
            console.error(err);
            interaction.reply({
                content: "An error occurred while trying to remove the seiyuu.",
            });
        }
    }
} as Command
