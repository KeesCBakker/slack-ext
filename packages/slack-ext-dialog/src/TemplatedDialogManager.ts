import { createJsonHandlebars } from "handlebars-a-la-json"
import { NamedTemplateParser } from "handlebars-dir"
import { TemplatedDialog } from "./TemplatedDialog";
import { ISlackMessageAdapter, ISlackApi, IActionCondition } from "./definitions";


export class TemplatedDialogManager{
    
    private _slackMessageAdapter: ISlackMessageAdapter;
    private _dialogs = new Array<TemplatedDialog>();
    private _templateParser: NamedTemplateParser;
    private _slackApi: ISlackApi;

    public jsonHandlebars: any;

    constructor(templateDirectory: string, slackApi: ISlackApi, slackMessageAdapter: ISlackMessageAdapter){
        this.jsonHandlebars = createJsonHandlebars();
        this._slackApi = slackApi;
        this._slackMessageAdapter = slackMessageAdapter;

        this._templateParser = new NamedTemplateParser(this.jsonHandlebars);
        this._templateParser.loadTemplatesFromDirectorySync(templateDirectory);
    }

    public createDialog(templateName: string, triggers: Array<IActionCondition>){
        const dialog = new TemplatedDialog(
            templateName, 
            this._templateParser, 
            templateName, 
            this._slackApi, 
            this._slackMessageAdapter,
            triggers);


        this._dialogs.push(dialog);
        return dialog;
    }
}
