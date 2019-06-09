"use strict";

import { expect } from "chai";
import { MockedSlackApi, MockedMessage } from "./mocks/MockedSlackApi";
import { UpdatableMessage } from "../src";


describe("UpdatableMessage", () => {

    it("Send single message", async() => {

        // arrange
        const slackApi = new MockedSlackApi();
        const sender = new UpdatableMessage(slackApi, 'general');

        // act
        await sender.send('This is awesome!');

        // assert
        expect(slackApi.chat.messages).to.have.lengthOf(1);
        expect(slackApi.chat.messages[0].channel).to.eql('general');
        expect(slackApi.chat.messages[0].data.text).to.eql('This is awesome!');
    });

    it("Update message", async() => {

        // arrange
        const slackApi = new MockedSlackApi();
        const sender = new UpdatableMessage(slackApi, 'general');

        // act
        sender.send('This is awesome!');
        await sender.send('This is also cool!');

        // assert
        expect(slackApi.chat.messages).to.have.lengthOf(1);
        expect(slackApi.chat.messages[0].channel).to.eql('general');
        expect(slackApi.chat.messages[0].data.text).to.eql('This is also cool!');
    });

    it("Update message with delay", async() => {

        // arrange
        const slackApi = new MockedSlackApi(20);
        const sender = new UpdatableMessage(slackApi, 'general');

        // act
        sender.send('This is awesome!');
        sender.send('This is also cool!');

        // assert
        expect(slackApi.chat.messages).to.have.lengthOf(1);
        expect(slackApi.chat.messages[0].channel).to.eql('general');
        expect(slackApi.chat.messages[0].data.text).to.eql('This is awesome!');
    });

    it("Update message multiple times.", async() => {

        // arrange
        const slackApi = new MockedSlackApi(20);
        const sender = new UpdatableMessage(slackApi, 'general');

        // act
        sender.send('This is awesome!');
        sender.send('This is also cool!');
        sender.send('I don\t know...');
        await sender.send('This really really exciting!');

        // assert
        expect(slackApi.chat.messages).to.have.lengthOf(1);
        expect(slackApi.chat.messages[0].channel).to.eql('general');
        expect(slackApi.chat.messages[0].data.text).to.eql('This really really exciting!');
    });

    it("Update existing message with know ts", async() => {

        // arrange
        const slackApi = new MockedSlackApi();
        slackApi.chat.messages.push(new MockedMessage('general', 'Initial', 'my-known-ts'))
        const sender = new UpdatableMessage(slackApi, 'general', 'my-known-ts');

        // act
        await sender.send('This really really exciting!');

        // assert
        expect(slackApi.chat.messages).to.have.lengthOf(1);
        expect(slackApi.chat.messages[0].channel).to.eql('general');
        expect(slackApi.chat.messages[0].data.text).to.eql('This really really exciting!');
        expect(slackApi.chat.messages[0].data.ts).to.eql('my-known-ts');
    });

});