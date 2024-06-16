import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type Command from "../interfaces/Command";
import User from "../models/User";
import Seiyuu from "../models/Seiyuu";
import Servers from "../models/Servers";
import { type Claim } from "../models/Servers";

export default {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Rolls a random seiyuu."),

        async execute(interaction: CommandInteraction) {
            try {
                const count = await Seiyuu.countDocuments();
                const randomSeiyuu = await Seiyuu.findOne().skip(Math.floor(Math.random() * count));

                if (!randomSeiyuu) {
                    return interaction.reply("Something went wrong. Please try again.");
                }

                var server = await Servers.findOne({ server_id: interaction.guildId });
                var interaction_user = await User.findOne({ discord_id: interaction.user.id });

                if (!interaction_user) {
                    interaction_user = new User({
                        discord_id: interaction.user.id
                    });

                    await interaction_user.save();
                }

                if (interaction_user.rolls == 0) {
                    return interaction.reply("You don't have any rolls left.");
                }

                interaction_user.rolls -= 1;
                await interaction_user.save();

                claim_check: if (server) {
                    const claim = server.claims.find(claim => claim.seiyuu.toString() === randomSeiyuu._id.toString());

                    if (!claim) {
                        break claim_check;
                    }

                    const user = await User.findOne({ _id: claim?.user });

                    if (!user) {
                        return interaction.reply("Something went wrong. Please try again.");
                    }

                    if (claim) {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(randomSeiyuu.name)
                                .setImage(randomSeiyuu.picture)
                                .setColor(Colors.Red)
                                .setDescription("Claimed by " + `<@${user.discord_id.toString()}>`)
                            ]
                        });
                    }
                }

                const embed = new EmbedBuilder()
                .setTitle(randomSeiyuu.name)
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

                try {
                    const collected = await response.awaitMessageComponent({
                        filter: i => i.customId === "claim",
                            time: 15000
                    });

                    if (collected.customId === "claim") {
                        var user = await User.findOne({ discord_id: collected.user.id });

                        // checks if server exists in the databvase
                        if (!server) {
                            server = new Servers({
                                server_id: interaction.guildId
                            });

                            await server.save();
                        }

                        // checks if user EXISTS i nthe datasbasd
                        if (!user) {
                            user = new User({
                                discord_id: collected.user.id,
                            });

                            await user.save();

                            const claim: Claim = {
                                user: user._id,
                                seiyuu: randomSeiyuu._id
                            }

                            server.claims.push(claim);

                            await server.save();

                            user.can_claim = false;
                            await user.save();
                        } else {
                            if (!user.can_claim) {
                                const message = await interaction.followUp({
                                    content: "You can't claim right now."
                                });

                                setTimeout(() => {
                                    message.delete();
                                }, 5000);

                                return;
                            };

                            const claim: Claim = {
                                user: user._id,
                                seiyuu: randomSeiyuu._id
                            }

                            server.claims.push(claim);

                            await server.save();

                            user.can_claim = false;
                            await user.save();
                        }

                        await interaction.editReply({
                            embeds: [embed
                                .setColor(Colors.Green)
                                .setDescription("Claimed by " + `${collected.user}`)
                            ],
                            components: []
                        });
                    }
                } catch (error) {
                    await interaction.editReply({
                        embeds: [embed],
                        components: []
                    });
                }
            } catch (error) {
                console.error(error);
                await interaction.reply("Something went wrong. Please try again.");
            }
        }
} as Command
