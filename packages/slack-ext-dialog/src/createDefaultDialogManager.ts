const { createMessageAdapter } = require('@slack/interactive-messages');
const Slack = require("slack");
import { ISlackApi } from './definitions';
import { TemplatedDialogManager } from "./TemplatedDialogManager";

export function createDefaultDialogManager(token: string, signingSecret: string, templateDirectory: string) {

    const slackApi = new Slack({ token: token }) as ISlackApi;
    const slackInteractions = createMessageAdapter(signingSecret);
    return new TemplatedDialogManager(templateDirectory, slackApi, slackInteractions);
}