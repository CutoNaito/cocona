import type { SeiyuuClient } from "../client";
import type Event from "../interfaces/Event";
import colors from "colors/safe";

export default {
	name: "ready",
	once: true,
	
	execute(client: SeiyuuClient) {
		console.log(colors.america(`Logged in as ${client.user?.tag}`));
	}
} as Event;