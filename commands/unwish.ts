import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type Command from "../interfaces/Command";
import User from "../models/User";
import Seiyuu from "../models/Seiyuu";
import Servers from "../models/Servers";
import { type Claim } from "../models/Servers";

export default {
    data: new SlashCommandBuilder()
    .setName("unwish")
    .setDescription("Remove a seiyuu from your wishlist.")
    .addStringOption(option =>
                     option.setName("seiyuu")
                     .setDescription("The seiyuu's name.")
                     .setRequired(true)
                    ),

                    async execute(interaction: ChatInputCommandInteraction) {
                        try {
                            const seiyuuName = interaction.options.getString("seiyuu") as string;
                            var user = await User.findOne({ discord_id: interaction.user.id });

                            if (!user) {
                                user = new User({
                                    discord_id: interaction.user.id
                                });

                                await user.save();
                            }

                            const seiyuu = await Seiyuu.findOne({ name: seiyuuName });

                            if (!seiyuu) {
                                interaction.reply({ content: "Seiyuu not found.", ephemeral: true });
                                return;
                            }

                            const server = await Servers.findOne({ server_id: interaction.guildId });
                            console.log(server);

                            if (!server) {
                                interaction.reply({ content: "Something went wrong. Please try again.", ephemeral: true });
                                return;
                            }

                            const wishExists = server.wishes.find(wish => wish.user.toString() === user?._id.toString() && wish.seiyuu.toString() === seiyuu._id.toString());

                            if (!wishExists) {
                                await interaction.reply({ content: "You don't have this seiyuu in your wishlist.", ephemeral: true });
                                return;
                            }

                            server.wishes = server.wishes.filter(wish => wish.user.toString() !== user?._id.toString() || wish.seiyuu.toString() !== seiyuu._id.toString());

                            await server.save();

                            seiyuu.tatemae -= 30;

                            await seiyuu.save();

                            await interaction.reply({
                                content: `Removed ${seiyuu.name} from your wishlist successfully.`,
                                ephemeral: true
                            });
                        } catch (err) {
                            console.log(err);
                            await interaction.reply({ content: "Something went wrong. Please try again.", ephemeral: true });
                        }
                    }
} as Command
