import { WebClient } from '@slack/web-api';
import { IMap, IProfile, ProfileWebAPICallResult } from '../definitions';

const cache: IMap<IProfile> = {};

export class ProfileService {

	constructor(private webClient: WebClient) {
	}

	async resolve(userId: string): Promise<IProfile | null> {
		let profile = cache[userId];
		if (profile) return profile;

		try {
			const slackUser = await this.webClient.users.profile.get({ user: userId }) as ProfileWebAPICallResult;
			profile = {
				id: userId,
				email: slackUser.profile.email,
				fullName: slackUser.profile.real_name,
				name: slackUser.profile.email.replace(/@.*$/, '')
			};

			cache[userId] = profile;
			return profile;
		}
		catch (ex) {
			console.log('DO YOU HAVE PERMISSION "users.profile:read" AND "users.profile:email"?', ex, ex.stack);
		}

		return null;
	}
}
