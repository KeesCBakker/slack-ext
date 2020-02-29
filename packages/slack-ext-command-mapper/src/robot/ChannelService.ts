import { WebClient } from '@slack/web-api';
import { IMap, IChannel, ChannelWebAPICallResult } from '../definitions';

const cache: IMap<IChannel> = {};

export class ChannelService {

	constructor(private webClient: WebClient) {
	}

	async resolve(channelId: string): Promise<IChannel | null> {
		let channel = cache[channelId];
		if (channel) return channel;

		try {
			const result = await this.webClient.conversations.info({ channel: channelId }) as ChannelWebAPICallResult;
			channel = {
				id: channelId,
				name: result && result.channel ? result.channel.name : ''
			};

			cache[channelId] = channel;
			return channel;
		}
		catch (ex) {
			console.log('DO YOU HAVE PERMISSION? channels:read, groups:read, im:read, mpim:read', ex, ex.stack);
		}

		return null;
	}
}
