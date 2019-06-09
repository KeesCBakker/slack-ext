import { ISlackMessageAdapter, IActionCondition, IPayload } from "../../src/definitions";

export class MockedSlackMessageAdapter implements ISlackMessageAdapter {

    private _actions = new Array<{
        condition: IActionCondition | String | RegExp,
        callback: (payload: IPayload) => void
    }>();

    public action(action: IActionCondition | String | RegExp, callback: (payload: IPayload) => void) {
        this._actions.push({
            condition: action,
            callback: callback
        });
    }

    public trigger(payload: IPayload) {

        for (let action of this._actions) {
            const condition = action.condition;
            const callback = action.callback;
            if (condition instanceof String) {

                if (!payload.callback_id)
                    continue;

                if (payload.callback_id == action.condition) {
                    callback(payload);
                    continue;
                }

                continue;
            }
            else if (condition instanceof RegExp) {
                if (!payload.callback_id)
                    continue;

                if (condition.test(payload.callback_id)) {
                    callback(payload);
                    continue;
                }

                continue;
            }
            else if (payload.actions == null || payload.actions.length == 0) {
                continue;
            }
            else {
                const ac = condition as IActionCondition
                if (!ac)
                    continue;

                const actionId = payload.actions[0].action_id;
                const blockId = payload.actions[0].block_id;

                if (ac.actionId instanceof String) {
                    if (ac.actionId != actionId)
                        continue;
                }
                else if (ac.actionId instanceof RegExp) {
                    if (!ac.actionId.test(actionId))
                        continue;
                }

                if (ac.blockId instanceof String) {
                    if (ac.blockId != blockId)
                        continue;
                }
                else if (ac.blockId instanceof RegExp) {
                    if (!ac.blockId.test(blockId))
                        continue;
                }

                callback(payload);
            }
        }
    }

}
