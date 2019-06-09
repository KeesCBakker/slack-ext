"use strict";

import { expect } from "chai";
import { TemplatedDialog } from "../src"
import { NamedTemplateParser } from "handlebars-dir"
import { createJsonHandlebars } from "handlebars-a-la-json"
import { MockedSlackMessageAdapter, MockedSlackApi } from "./mocks"


describe("TemplateDialog", () => {

    it("Open on action", (done) => {

        // arrange
        const handlebars = createJsonHandlebars();
        const parser = new NamedTemplateParser(handlebars);
        parser.loadTemplatesFromDirectorySync('./test/templates')

        const slackApi = new MockedSlackApi();
        const adapter = new MockedSlackMessageAdapter();
        const dialog = new TemplatedDialog('tst', parser, 'dialog', slackApi, adapter, [{ actionId: 'hello' }]);

        dialog.onOpen.sub((sender, args) => {
            args.callback({
                title: "My first dialog"
            });
        });

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
                    callback_id: 'submit_tst'
                },
                trigger_id: 'random_trigger_id'
            })
            done();
        }, 10);

    });

    it("Submit callback", (done) => {

        // arrange
        const handlebars = createJsonHandlebars();
        const parser = new NamedTemplateParser(handlebars);
        parser.loadTemplatesFromDirectorySync('./test/templates')

        const slackApi = new MockedSlackApi();
        const adapter = new MockedSlackMessageAdapter();
        const dialog = new TemplatedDialog('tst', parser, 'dialog', slackApi, adapter, [{ actionId: 'hello' }]);

        dialog.onOpen.sub((sender, args) => {
            args.callback({
                title: "My first dialog"
            });
        });

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