"use strict";

import { EventDispatcher, IEvent } from "ste-events";
import { INamedTemplateParser } from "handlebars-dir"
import { ISlackApi, ISlackMessageAdapter, IPayload, IActionCondition } from "./definitions";

export class TemplatedDialog {

    private _id: string;
    private _parser: INamedTemplateParser;
    private _slackApi: ISlackApi;
    private _adapter: ISlackMessageAdapter;
    private _dialogTemplateName: string;

    private _onOpen = new EventDispatcher<TemplatedDialog, TemplatedDialogDataRequest>();
    private _onSubmit = new EventDispatcher<TemplatedDialog, IPayload>();
    private _callbackId: string;

    constructor(
        id: string,
        parser: INamedTemplateParser,
        dialogTemplateName: string,
        slackApi: ISlackApi,
        adapter: ISlackMessageAdapter,
        triggers: Array<IActionCondition>) {

        this._id = id;
        this._parser = parser;
        this._dialogTemplateName = dialogTemplateName;
        this._slackApi = slackApi;
        this._adapter = adapter;
        this._callbackId = 'submit_' + this._id;

        for (let trigger of triggers) {
            this._adapter.action(trigger, async (payload) => await this.open(payload));
        }

        this._adapter.action(this._callbackId, (payload: IPayload) => this.submit(payload));
    }

    public get onOpen(): IEvent<TemplatedDialog, TemplatedDialogDataRequest> {
        return this._onOpen.asEvent();
    }

    public get onSubmit(): IEvent<TemplatedDialog, IPayload> {
        return this._onSubmit.asEvent();
    }

    private async open(payload: IPayload) {

        const data = await new Promise<any>(resolve => {
            this._onOpen.dispatch(this, new TemplatedDialogDataRequest(payload, (templateData) => resolve(templateData)));
        });

        data.trigger_id = payload.trigger_id;
        data.callback_id = this._callbackId;
        const dialog = this._parser.parse<any, any>(this._dialogTemplateName, data);
        dialog.trigger_id = payload.trigger_id;

        // validate
        if (!dialog.trigger_id)
            throw 'Invalid dialog: missing trigger_id property.';
        if (!dialog.dialog)
            throw 'Invalid dialog: missing dialog property.';

        dialog.dialog.callback_id = this._callbackId;

        await this._slackApi.dialog.open(dialog);
    }

    private submit(payload: IPayload) {
        this._onSubmit.dispatchAsync(this, payload);
    }

}

export class TemplatedDialogDataRequest {

    constructor(public payload: IPayload, public callback: (templateData: any) => void) { }
}
