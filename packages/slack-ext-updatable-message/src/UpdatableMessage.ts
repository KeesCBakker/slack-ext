import { ISlackApi, IMessageResult } from "./defintions";

const Slack = require("slack");

export function sendMessage(token: string | ISlackApi, channel: string, ts: string | null, msg: any): Promise<IMessageResult> {

  let api:ISlackApi;
  if(typeof token == "string"){
    api = new Slack({ token: token }) as ISlackApi;
  }
  else{
    api = token;
  }

  let data = {} as any;
  if (Object.prototype.toString.call(msg) === "[object String]") {
    data.text = msg;
  }
  else {
    data = msg;
    if (!data.text) {
      data.text = ' ';
    }
  }

  data.channel = channel;
  data.as_user = true;

  if (ts) {
    data.ts = ts;
    return api.chat.update(data).then(x => ({
      channel: x.channel,
      ts: x.ts
    }));
  }

  // posting directly to a user can cause the channel id to change,
  // so make sure the channel id is updated.
  return api.chat.postMessage(data).then(x => ({
    channel: x.channel,
    ts: x.ts
  }));
}

export class UpdatableMessage {

  private _channel: string;
  private _ts: string | null;
  private _message: any;
  private _nextMessage: any;
  private _sendingProm: Promise<string | null> | null;
  private _sending: boolean;
  private _slackApi: any;

  constructor(token: string | ISlackApi, channel: string, ts: string | null = null) {

    this._channel = channel;
    this._ts = ts;
    this._message = null;
    this._nextMessage = null;
    this._sendingProm = null;
    this._sending = false;

    if(typeof token == "string"){
      this._slackApi = new Slack({ token: token }) as ISlackApi;
    }
    else{
      this._slackApi = token;
    }
  }

  send(msg: any): Promise<string | null> {

    // don't send empty or the same message
    if (!msg || msg === this._message) {
      return Promise.resolve(this._ts);
    }

    // when sending, add to later
    if (this._sending) {
      this._nextMessage = msg;
      return Promise.resolve(this._sendingProm);
    }

    this._sending = true;
    this._message = msg;
    this._sendingProm = sendMessage(this._slackApi, this._channel, this._ts, msg)
      .then(async x => {
        this._ts = x.ts || this._ts;
        this._channel = x.channel || this._channel;
        this._sending = false;
        const msg = this._nextMessage;
        this._nextMessage = null;
        return await this.send(msg);
      });

    return this._sendingProm;
  }

}