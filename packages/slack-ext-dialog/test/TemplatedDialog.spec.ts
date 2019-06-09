"use strict";

import { expect } from "chai";
import { TemplatedDialog } from "../src"
import { NamedTemplateParser } from "handlebars-dir"
import { createJsonHandlebars } from "handlebars-a-la-json"
import { MockedSlackMessageAdapter, MockedSlackApi } from "./mocks"
import { IActionCondition } from "../src/definitions";

function setup(slackApi: MockedSlackApi, adapter: MockedSlackMessageAdapter, actionCondition: IActionCondition) {

    const handlebars = createJsonHandlebars();
    const parser = new NamedTemplateParser(handlebars);
    parser.loadTemplatesFromDirectorySync('./test/templates')

    return new TemplatedDialog('tst', parser, 'dialog', slackApi, adapter, [actionCondition]);
}


describe("TemplateDialog", () => {

    it("Open on action", (done) => {

        // arrange
        const slackApi = new MockedSlackApi();
        const adapter = new MockedSlackMessageAdapter();
        const dialog = setup(slackApi, adapter, { actionId: 'hello' });

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

});