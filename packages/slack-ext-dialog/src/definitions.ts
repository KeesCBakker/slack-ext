export interface ISlackApi {
    dialog: {
        open: (dialog: any) => Promise<void>
    }
}

export interface IActionCondition {
    blockId?: string | RegExp;
    actionId?: string | RegExp;
    callbackId?: string | RegExp;
}

export interface ISlackMessageAdapter {
    action(action: IActionCondition | string | RegExp, callback: (payload: IPayload) => void): void
}

export interface IPayload {
    name?: string,
    trigger_id: string,
    user?: {
        id: string,
        name: string
    },
    actions?: Array<IAction>,
    container?: {
        channel_id: string
    },
    channel?: {
        id: string
    },
    state?: any;
    submission?: any;
    callback_id?: string;
}

export interface IAction {
    action_id: string,
    block_id: string,
    selected_option?: {
        value: string
    }
}