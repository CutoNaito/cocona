import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type Command from "../interfaces/Command";
import User from "../models/User";
import Seiyuu from "../models/Seiyuu";
import Servers from "../models/Servers";
import { type Claim } from "../models/Servers";

export default {
    data: new SlashCommandBuilder()
        .setName("show")
        .setDescription("Shows a seiyuu.")
        .addStringOption(option =>
            option.setName("seiyuu")
                .setDescription("The seiyuu's name.")
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const seiyuu_name = interaction.options.getString("seiyuu") as string;
            const seiyuu = await Seiyuu.findOne({ name: seiyuu_name });

            if (!seiyuu) {
                interaction.reply({
                    content: "Invalid seiyuu name.",
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

            const claim = server.claims.find((claim: Claim) => claim.seiyuu.toString() === seiyuu._id.toString());

            const embed = new EmbedBuilder()
                .setTitle(seiyuu.name)
                .setImage(seiyuu.picture)
                .setDescription(`${seiyuu.tatemae}:cherry_blossom:`)
                .setColor(Colors.Purple);

            if (claim) {
                const user = await User.findOne({ _id: claim.user });

                if (!user) {
                    interaction.reply({
                        content: "An error occurred while trying to fetch the user.",
                    });

                    return;
                };

                embed.setDescription(`${seiyuu.tatemae}:cherry_blossom:\n\n` + "Claimed by " + `<@${user.discord_id.toString()}>`);
            }

            await interaction.reply({
                embeds: [embed],
            });

        } catch (err) {
            console.error(err);
            interaction.reply({
                content: "An error occurred while trying to remove the seiyuu.",
            });
        }
    }
} as Command
