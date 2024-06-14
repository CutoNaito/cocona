import { Client, Collection, CommandInteraction, SlashCommandBuilder, type ClientOptions } from "discord.js";
import type Command from "./interfaces/Command";
import type Event from "./interfaces/Event";
import colors from "colors/safe";

export class SeiyuuClient extends Client {
    public commands: Collection<string, Command> = new Collection();

    constructor(options: ClientOptions, commands: Command[], events: Event[]) {
        super(options);

        for (const command of commands) {
            this.commands.set(command.data.name, command);
			console.log(colors.green(`Loaded command: ${command.data.name}`));
        }

		for (const event of events) {
			if (event.once) {
				this.once(event.name, (...args) => event.execute(...args, this));
			} else {
				this.on(event.name, (...args) => event.execute(...args, this));
			}

			console.log(colors.green(`Loaded event: ${event.name}`));
		}
    }
}

console.log()
