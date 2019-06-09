const { createMessageAdapter } = require('@slack/interactive-messages');
const Slack = require("slack");

import { TemplatedDialog, TemplatedDialogDataRequest } from "./TemplatedDialog";
import { TemplatedDialogManager } from "./TemplatedDialogManager";
import { ISlackApi } from './definitions';

export function createDefaultDialogManager(token: string, signingSecret: string, templateDirectory: string){

    const slackApi = new Slack({token: token}) as ISlackApi;
    const slackInteractions = createMessageAdapter(signingSecret);
    return new TemplatedDialogManager(templateDirectory, slackApi, slackInteractions);
}

export {
    TemplatedDialog,
    TemplatedDialogManager,
    TemplatedDialogDataRequest as TemplateDialogDataRequest
};
