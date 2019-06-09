import { TemplatedDialogManager } from "./TemplatedDialogManager";
import { TemplatedDialog } from "./TemplatedDialog";
import { IActionCondition, IPayload } from "./definitions";

class DialogFormBase {

    private _dialog: TemplatedDialog;

    constructor(public templateName: string, manager: TemplatedDialogManager) {

        const triggers = this.getTriggers();
        this._dialog = manager.createDialog(templateName, triggers);
        this._dialog.onOpen.sub(async (dialog, data) => {
            data.callback(await this.getFormData());
        });
        this._dialog.onSubmit.sub(async (dialog, payload) => await this.processResult(payload));
    }

    protected getTriggers(): Array<IActionCondition> {
        throw 'getTriggers not implemented';
    }

    protected async getFormData(): Promise<any> {
        throw 'getFormData not implemented';
    }

    protected async processResult(payload: IPayload): Promise<void> {
        throw 'processResult not implemented';
    }
}

class MyDialogForm extends DialogFormBase{

    constructor(public templateName: string, manager: TemplatedDialogManager) {
        super(templateName, manager);
    }

    protected getTriggers(): Array<IActionCondition>{
        return [{
            actionId: 'test'
        }];
    }
}