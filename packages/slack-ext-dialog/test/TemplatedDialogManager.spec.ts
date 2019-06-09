"use strict";

import { expect } from "chai";
import { TemplatedDialogManager } from "../src"
import { MockedSlackMessageAdapter, MockedSlackApi } from "./mocks"


describe("TemplateDialogManager", () => {

    it("Open on action", (done) => {

        // arrange
        const slackApi = new MockedSlackApi();
        const adapter = new MockedSlackMessageAdapter();
        const manager = new TemplatedDialogManager('./test/templates', slackApi, adapter);
        const dialog = manager.createDialog('tst', 'dialog', [{ actionId: 'hello' }]);

        // act
        dialog.onOpen.sub((sender, args) => {
            args.callback({
                title: "My first dialog"
            });
        });

        adapter.trigger({
            trigger_id: 'random_trigger_id',
            actions: [{
                block_id: 'block',
                action_id: 'hello'
            }]
        });

        // assert
        setTimeout(() => {
            expect(slackApi.dialog.openedDialog).to.deep.equal({
                dialog:
                {
                    title: 'My first dialog',
                    submit_label: 'OK',
                    elements: [{
                        "type": "text",
                        "label": "Message",
                        "name": "message"
                    }],
                    callback_id: 'submit_tst'
                },
                trigger_id: 'random_trigger_id'
            })
            done();
        }, 10);

    });

    it("Submit callback", (done) => {

        // arrange
        const slackApi = new MockedSlackApi();
        const adapter = new MockedSlackMessageAdapter();
        const manager = new TemplatedDialogManager('./test/templates', slackApi, adapter);
        const dialog = manager.createDialog('tst', 'dialog', [{ actionId: 'hello' }]);

        dialog.onSubmit.sub((sender, args) => {

            // assert
            expect(args).to.deep.equal({
                trigger_id: 'random_trigger_id',
                callback_id: 'submit_tst',
                submission: {
                    message: 'test'
                }
            });

            done();
        });

        // act
        adapter.trigger({
            trigger_id: 'random_trigger_id',
            callback_id: 'submit_tst',
            submission: {
                message: 'test'
            }
        });
    });

});