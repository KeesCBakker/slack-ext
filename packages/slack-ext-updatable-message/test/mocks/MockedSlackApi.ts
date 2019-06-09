
import { ISlackApi, IChatEndPoint, IMessageResult } from "../../src/defintions";

export class MockedSlackApi implements ISlackApi {

    chat: MockedChatEndPoint;

    constructor(delay = 0) {
        this.chat = new MockedChatEndPoint(delay);
    }
}

export class MockedChatEndPoint implements IChatEndPoint {

    public messages = new Array<MockedMessage>();
    delay: number;

    constructor(delay = 0) {
        this.delay = delay;
    }

    postMessage(data: any) {
        let message = new MockedMessage(data.channel, data, data.ts);
        this.messages.push(message);
        return delayedReturn(this.delay, message as IMessageResult);
    }

    update(data: any) {

        for (let message of this.messages) {
            if (message.ts == data.ts) {
                message.data = data;
                return delayedReturn(this.delay, message as IMessageResult);
            }
        }

        throw 'Invalid';
    }
}

function delayedReturn<T>(delay: number, data: T): Promise<T> {
    if (delay) {
        return new Promise(resolve => {
            setTimeout(() => resolve(data), delay);
        })
    }
    return Promise.resolve(data);
}


let counter = 1;

export class MockedMessage implements IMessageResult {
    public channel: string;
    public data: any;
    public ts: string;

    constructor(channel: string, data: any, ts: string | null = null) {
        this.channel = channel;
        this.data = data;
        this.ts = ts || new Date().toString() + '.' + ++counter;
    }
}