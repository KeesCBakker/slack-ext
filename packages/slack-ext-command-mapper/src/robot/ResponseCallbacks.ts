import { ListenerCallback } from "../definitions";

export class ResponseCallbacks {
	constructor(public regex: RegExp, public callback: ListenerCallback) {
	}
}
