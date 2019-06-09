import { TemplatedDialogManager } from "./TemplatedDialogManager";
import { TemplatedDialog } from "./TemplatedDialog";
import { IActionCondition, IPayload } from "./definitions";

export class TemplatedDialogForm {

    private _dialog: TemplatedDialog;

    constructor(public id: string, public templateName: string, manager: TemplatedDialogManager) {

        const triggers = this.getTriggers();
        this._dialog = manager.createDialog(id, templateName, triggers);
        this._dialog.onOpen.sub(async (dialog, data) => {
            data.callback(await this.getTemplateData(data.payload));
        });
        this._dialog.onSubmit.sub((dialog, payload) => this.onSubmit(payload));
    }

    protected getTriggers(): Array<IActionCondition> {
        throw 'getTriggers not implemented';
    }

    protected async getTemplateData(payload: IPayload): Promise<any> {
        throw 'getTemplateData not implemented';
    }

    protected async onSubmit(payload: IPayload): Promise<void> {
        throw 'onSubmit not implemented';
    }
}
