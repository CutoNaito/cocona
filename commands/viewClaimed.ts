import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type Command from "../interfaces/Command";
import User from "../models/User";
import Seiyuu from "../models/Seiyuu";
import Servers from "../models/Servers";
import { type Claim } from "../models/Servers";

export default {
    data: new SlashCommandBuilder()
        .setName("viewclaimed")
        .setDescription("Shows a list of claimed seiyuus for a user."),

    async execute(interaction: CommandInteraction) {
        const user = await User.findOne({ discord_id: interaction.user.id });
        const server = await Servers.findOne({ server_id: interaction.guildId });
        var seiyuuList: string[] = [];

        if (server && user) {
            for (let i = 0; i < server.claims.length; i++) {
                if (server.claims[i].user.toString() === user._id.toString()) {
                    const seiyuu = await Seiyuu.findOne({ _id: server.claims[i].seiyuu });
                    if (!seiyuu) continue;
                    seiyuuList.push(seiyuu.name);
                }
            }
        }

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle("Claimed Seiyuus")

        if (seiyuuList.length > 0) {
            embed.setDescription(
                seiyuuList.join("\n")
            );
        }

        await interaction.reply({
            embeds: [embed],
        });
    }
} as Command
