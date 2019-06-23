import { createJsonHandlebars } from "handlebars-a-la-json"
import { NamedTemplateParser } from "handlebars-dir"
import { TemplatedDialog } from "./TemplatedDialog";
import { ISlackMessageAdapter, ISlackApi, IActionCondition } from "./definitions";
import { IHandlebars } from "handlebars-a-la-json/dist/makeHandlebarsBehave";

export class TemplatedDialogManager{
    
    private _slackMessageAdapter: ISlackMessageAdapter;
    private _dialogs = new Array<TemplatedDialog>();
    private _slackApi: ISlackApi;

    public jsonHandlebars: IHandlebars;
    public templateParser: NamedTemplateParser;

    constructor(templateDirectory: string, slackApi: ISlackApi, slackMessageAdapter: ISlackMessageAdapter){
        this.jsonHandlebars = createJsonHandlebars();
        this._slackApi = slackApi;
        this._slackMessageAdapter = slackMessageAdapter;

        this.templateParser = new NamedTemplateParser(this.jsonHandlebars);
        this.templateParser.loadTemplatesFromDirectorySync(templateDirectory);
    }

    public createDialog(id: string, templateName: string, triggers: Array<IActionCondition>){
        const dialog = new TemplatedDialog(
            id, 
            this.templateParser, 
            templateName, 
            this._slackApi, 
            this._slackMessageAdapter,
            triggers);


        this._dialogs.push(dialog);
        return dialog;
    }
}
