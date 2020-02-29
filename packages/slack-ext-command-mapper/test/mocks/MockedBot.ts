import { IRobot, Robot } from "../../src";

class MockedEventsApiRegistration {
	constructor(public type: string, public callback: (event: any) => void) {
	}
}

class MockedWebApi {

	users: { profile: { get: (request: { user: string; }) => { id: string; profile: { email: string; real_name: string; }; }; }; };
	conversations: { info: (id: string) => { id: string; channel: { name: string; }; }; };
	chat: { postMessage: (event: any) => void; };

	constructor(private callback: (event: any) => void) {
		this.users = {
			profile: {
				get: (request: {user: string}) => {
					let id = request.user;
					return {
						id: id,
						profile: {
							email: id + '@test.nl',
							real_name: id + ' ' + id
						}
					}
				}
			}
		};

		this.conversations = {
			info: (id: string) => {
				return {
					id: id,
					channel: {
						name: id
					}
				}
			}
		};

		this.chat = {
			postMessage: (event: any) => this.callback(event)
		}
	}
}

class MockedEventsApi {
	private _registrations: MockedEventsApiRegistration[] = [];

	constructor() { }

	on(type: string, callback: (event: any) => void) {
		this._registrations.push(new MockedEventsApiRegistration(type, callback));
	}

	dispatch(type: string, event: any) {

		this._registrations
			.filter(x => x.type == type)
			.forEach(x => x.callback(event));
	}
}

export class Pretend {

	public mockedEvents: MockedEventsApi;
	public mockedWebApi: MockedWebApi;
	public robot: IRobot;
	private _user: string;
	private _name: string;
	public messages: string[][] = [];

	constructor() {
	}

	start(name = "hubot") {

		this._name = name;
		this.messages = [];

		let events = new MockedEventsApi();
		let webApi = new MockedWebApi(event => {
			let txt = event.text;
			txt = txt.replace(/<(@\w+)>/g, "$1");
			this.messages.push(["hubot", txt]);
		});

		this.mockedEvents = events;
		this.mockedWebApi = webApi;
		this.robot = new Robot(events as any, webApi as any);
	}

	shutdown() {
		this.messages = [];
	}

	user(name: string) {
		this._user = name;
		return this;
	}

	send(msg: string): Promise<void> {


		this.messages.push([this._user, msg]);
		msg = msg.replace(/^(@\w+)/, "<$1>");
		this.mockedEvents.dispatch("app_mention", {
			text: msg,
			channel: 'TST',
			user: this._user,
			type: "app_mention"
		});

		return new Promise(resolve => {
			setTimeout(() => resolve(), 4);
		});
	}
}


export function getDefaultMockedBot() {
	return new Pretend();
}
