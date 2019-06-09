# Slack EXT: Dialog
Dialogs are a nice feature of Slack. Setting them up might be a hassle that's why we've created a few shortcuts to get your dialogs working fast. It is template based, so you can easily change your dialogs without having to change your JavaScript code.

## Installation
Install it using NPM:
```shell
npm install --save slack-ext-dialog
```

## Fastest way: create form class


```js
const { TemplatedDialogForm } = require("slack-ext-dialog");

class TestForm extends TemplatedDialogForm {

    submission: any | null = null;

    constructor(manager: TemplatedDialogManager) {
        // the id of the dialog wil be 'tst'
        // we're going to use 'dialog' template
        super('tst', 'dialog', manager);
    }

    getTriggers() {
        // the dialog is going to be shown, whenever
        // an action with 'hello' is triggerd
        return [{ actionId: 'hello' }]
    }

    async getTemplateData(payload) {
        await Promise.resolve({
            "title": "My first dialog"
        });
    }

    async onSubmit(payload: IPayload) {
        this.submission = payload.submission;
        await Promise.resolve();
    }

}
```
Now we need to hook the dialog up:
```js
const { createDefaultDialogManager } = require("slack-ext-dialog");

const templateDir = "./templates";
const manager = createDefaultDialogManager("slack-token", "slack-signing-sercret", templateDir);

const dialog = new TestForm(manager);
```
Now you'll need to make sure you'll hand a handlebars template named `dialog.handlebars`, like this:
```js
{
    "dialog": {
        "title": "{{title}}",
        "submit_label": "OK",
        "elements": [
            {
                "type": "text",
                "label": "Message",
                "name": "message"
            }
        ]
    }
}
```
That's it!