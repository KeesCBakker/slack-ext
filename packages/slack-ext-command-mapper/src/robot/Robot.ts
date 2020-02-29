import { SlackEventAdapter } from '@slack/events-api/dist/adapter';
import { ChannelService } from './ChannelService';
import { ProfileService } from './ProfileService';
import { RobotResponse } from './RobotResponse';
import { ResponseCallbacks } from './ResponseCallbacks';
import { AliasRegistration } from './AliasRegistration';
import { WebClient } from '@slack/web-api';
import { IRobot, IMessage, ListenerCallback, ProfileWebAPICallResult } from '../definitions';
import fs from "fs"
import path from "path";

export class Robot implements IRobot {


	private _callbacks: ResponseCallbacks[] = [];
	private _aliases: AliasRegistration[] = [];
	private _profileService: ProfileService;
	private _channelService: ChannelService;
	private _botName: string = "";
	private _botId: string = "";
	private _botInit: boolean = false;

	constructor(
		public eventAdapter: SlackEventAdapter,
		public webClient: WebClient) {

		if (eventAdapter == null) {
			throw new Error("eventAdapter is null");
		}
		if (webClient == null) {
			throw new Error("eventAdapter is null");
		}

		this.eventAdapter.on('message', (event) => {
			if (event.channel_type == "im" && !event.bot_profile && event.text) {
				this.dispatch(event, true);
			}
		});

		this.eventAdapter.on('app_mention', (event) => {
			if (event.text) {
				event.text = event.text.replace(/^<@\w+>\s/, '');
				this.dispatch(event, false);
			}
		});

		this._profileService = new ProfileService(webClient);
		this._channelService = new ChannelService(webClient);

		// init bot settings
		this.ensureInit();
	}

	public async getBotName(): Promise<string> {
		await this.ensureInit();
		return this._botName;
	}

	public async getBotId(): Promise<string> {
		await this.ensureInit();
		return this._botId;
	}

	private async ensureInit(): Promise<void> {

		if (this._botInit) return;

		const result = await this.webClient.users.profile.get({}) as ProfileWebAPICallResult;

		this._botInit = false;
		this._botName = result.profile.real_name;
		this._botId = result.profile.bot_id;
	}

	protected async dispatch(event, isOneOnOneChat: boolean, isAlias = false) {
		const match = this._callbacks.find(x => event.text.match(x.regex));
		if (match) {
			const matchCollection = match.regex.exec(event.text);
			const message: IMessage = {
				user: await this._profileService.resolve(event.user),
				channel: await this._channelService.resolve(event.channel),
				id: event.event_ts,
				text: event.text,
				files: event.files
			};
			const r = new RobotResponse(matchCollection, message, this.webClient, isOneOnOneChat)
			match.callback(r);
		}
		else if (event.text.endsWith("help")) {
			//skip
		}
		// prevent loops!
		else if (!isAlias) {

			// do we have an alias?
			let alias = this._aliases.find(x => x.name != "" && event.text.startsWith(x.name));
			if (alias) {
				event.text = alias.destination + event.text.substr(alias.name.length);
				this.dispatch(event, isOneOnOneChat, true);
			}
			else {
				// no alias, default alias?
				alias = this._aliases.find(x => x.name == "");
				if (alias) {
					event.text = alias.destination + " " + event.text;
					this.dispatch(event, isOneOnOneChat, true);
				}
			}
		}
	}

	public registerAlias(name: string, destination: string) {
		if (destination == null || destination == "") throw "Argument 'destination' is empty.";

		if (name == "" && this._aliases.find(x => x.name == ""))
			throw 'A default has already been mapped. Cannot map a 2nd default alias.';

		this._aliases.push(new AliasRegistration(name, destination));
	}

	public respond(regex: RegExp, callback: ListenerCallback) {
		this._callbacks.push(new ResponseCallbacks(regex, callback));
	}

	public async messageRoom(channel: string, msg: string) {
		var result = await this.webClient.chat.postMessage({
			channel: channel,
			text: msg
		});

		return result.ts;
	}

	public mapCommandsFromDirectory(directory: string) {
		const files = fs.readdirSync(directory);
		files
			.filter(file => path.extname(file) == ".js")
			.forEach(file => {
				const fullFilePath = path.join(directory, file);
				require(fullFilePath)(this);
			});
	}

}


