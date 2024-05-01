import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type Command from "../interfaces/Command";
import User from "../models/User";
import Seiyuu from "../models/Seiyuu";
import Servers from "../models/Servers";
import { type Claim } from "../models/Servers";

export default {
    data: new SlashCommandBuilder()
        .setName("dump")
        .setDescription("Removes a seiyuu from your claimed list.")
        .addStringOption(option =>
            option.setName("seiyuu")
                .setDescription("The seiyuu's name.")
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const seiyuu_name = interaction.options.getString("seiyuu") as string;
        const user = await User.findOne({ discord_id: interaction.user.id });

        if (!user) {
            interaction.reply({
                content: "You need to claim a seiyuu first!",
            });

            return;
        };

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

        const claim = server.claims.find((claim: Claim) => claim.user.toString() === user._id.toString() && claim.seiyuu.toString() === seiyuu._id.toString());

        if (!claim) {
            interaction.reply({
                content: "You haven't claimed this seiyuu.",
            });

            return;
        };

        const index = server.claims.indexOf(claim);
        if (index > -1) {
            server.claims.splice(index, 1);

            server.save()
                .then(() => {
                    interaction.reply({
                        content: `Seiyuu ${seiyuu_name} removed successfully!`,
                    });
                })
                .catch((err) => {
                    console.error(err);
                    interaction.reply({
                        content: "An error occurred while trying to remove the seiyuu.",
                    });
                });
        }
    }
} as Command
