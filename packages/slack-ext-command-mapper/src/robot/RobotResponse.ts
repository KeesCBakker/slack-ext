import { WebClient } from '@slack/web-api';
import { IResponse, IMessage, ChatPostMessageWebAPICallResult } from "../definitions";

export class RobotResponse implements IResponse {

	constructor(
		public match: RegExpMatchArray,
		public message: IMessage,
		public webClient: WebClient,
		public isOneOnOneChat: boolean
	) {
	}

	reply(text: string): Promise<ChatPostMessageWebAPICallResult> {

		if (!this.isOneOnOneChat) {
			text = `@${this.message.user.name.toLowerCase()} ${text}`;
		}

		return this.emote(text);
	}

	async emote(text: string): Promise<ChatPostMessageWebAPICallResult> {
		return await this.webClient.chat.postMessage({
			text: text,
			channel: this.message.channel.id,
			as_user: true,
			parse: "full"
		}) as ChatPostMessageWebAPICallResult;
	}

}
