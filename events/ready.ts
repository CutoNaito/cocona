import type Event from "../interfaces/Event";

export default {
	name: "ready",
	once: true,
	
	execute() {
		console.log("Ready!");
	}
} as Event;