import { ISlackApi } from "../../src/definitions";

export class MockedSlackApi implements ISlackApi {
    public dialog = new MockedSlackApiDialogEndPoint();
}

export class MockedSlackApiDialogEndPoint {
    openedDialog: any = null;

    constructor() {
    }

    open(dialog: any): Promise<void> {
        this.openedDialog = dialog;
        return new Promise<void>(resolve => resolve());
    }
}