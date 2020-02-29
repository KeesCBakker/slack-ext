import { WebAPICallResult } from "@slack/web-api";

export interface ProfileWebAPICallResult extends WebAPICallResult {
	profile: {
		email: string;
		real_name: string;
		bot_id?: string;
	};
}

export interface ChannelWebAPICallResult extends WebAPICallResult {
	channel: {
		name: string;
	};
}

export interface ChatPostMessageWebAPICallResult extends WebAPICallResult {
	channel: string;
	ts: string;
	message: {
		test: string;
		username: string;
		bot_id?: string;
		attachments: [{
			text: string;
			id: number;
			fallback: string;
		}],
		type: string;
		subtype: string;
		ts: string;
	}
}


export interface ChatUpdateMessageWebAPICallResult extends WebAPICallResult {
	channel: string;
	ts: string;
	text: string;
}
