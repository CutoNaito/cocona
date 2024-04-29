import type Event from "../interfaces/Event";
import colors from 'colors/safe';

export default {
	name: "ready",
	once: true,
	
	execute() {
		console.log(colors.america('Logged in as ${c.user?.tag}'));
	}
} as Event;