"use strict";

import { expect } from "chai";
import { TemplatedDialogManager } from "../src"
import { MockedSlackMessageAdapter, MockedSlackApi } from "./mocks"
import { TemplatedDialogForm } from "../src/TemplatedDialogForm";
import { IPayload } from "../src/definitions";


class TestForm extends TemplatedDialogForm {

    submission: any | null = null;

    constructor(manager: TemplatedDialogManager) {
        super('dialog', manager);
    }

    getTriggers() {
        return [{ actionId: 'hello' }]
    }

    async getTemplateData(payload: IPayload) {
        await Promise.resolve();
        return {
            "title": "My first dialog"
        }
    }

    async onSubmit(payload: IPayload) {
        await Promise.resolve();
        this.submission = payload.submission;
    }

}


describe("TemplateDialogForm", () => {

    it("Open on action", (done) => {

        // arrange
        const slackApi = new MockedSlackApi();
        const adapter = new MockedSlackMessageAdapter();
        const manager = new TemplatedDialogManager('./test/templates', slackApi, adapter);
        const dialog = new TestForm(manager);

        // act
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
                    callback_id: 'submit_dialog'
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
        const dialog = new TestForm(manager);

        // act
        adapter.trigger({
            trigger_id: 'random_trigger_id',
            callback_id: 'submit_dialog',
            submission: {
                message: 'test'
            }
        });

        // assert
        setTimeout(() => {
            expect(dialog.submission).to.deep.equal({
                message: 'test'
            });

            done();
        }, 10);
    });

});