import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type Command from "../interfaces/Command";
import Seiyuu from "../models/Seiyuu";

export default {
    data: new SlashCommandBuilder()
        .setName("addseiyuu")
        .setDescription("Adds a seiyuu.")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("The seiyuu's name.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("picture")
                .setDescription("The seiyuu's picture.")
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName("tatemae")
                .setDescription("The seiyuu's tatemae.")
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const name = interaction.options.getString("name") as string;
        const picture = interaction.options.getString("picture") as string;
        const tatemae = interaction.options.getNumber("tatemae") as number;

        const newSeiyuu = new Seiyuu({
            name,
            picture,
            tatemae
        });

        newSeiyuu.save()
            .then(() => {
                interaction.reply({
                    content: `Seiyuu ${name} added successfully!`,
                    ephemeral: true
                });
            })
            .catch((err) => {
                console.error(err);
                interaction.reply({
                    content: "An error occurred while trying to add the seiyuu.",
                    ephemeral: true
                });
            });
    }
} as Command
