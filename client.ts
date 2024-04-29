import { Client, Collection, CommandInteraction, SlashCommandBuilder, type ClientOptions } from "discord.js";

interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => void;
}

export class SeiyuuClient extends Client {
    public commands: Collection<string, Command> = new Collection();

    constructor(options: ClientOptions, commands: Command[]) {
        super(options);

        for (const command of commands) {
            this.commands.set(command.data.name, command);
        }
    }


}
