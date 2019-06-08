"use strict";

import * as fs from "fs";
import * as path from "path";

export interface INamedTemplateParser {
    parse<T, R>(name: string, templateData: T): R;
}

export class NamedTemplateParser implements INamedTemplateParser {

    private templates: any;

    constructor(public handlebars: any) {
        this.templates = {};
    }

    async loadTemplatesFromDirectory(templateDirectory: string): Promise<void> {
        let files = await readDir(templateDirectory);
        files = files.filter(f => f.endsWith('.handlebars') || f.endsWith('.hbs'))
        for (let file of files) {
            const filePath = path.join(templateDirectory, file);
            const contents = await readFile(filePath);
            this.process(file, contents.toString());
        }
    }

    loadTemplatesFromDirectorySync(templateDirectory: string): void {

        let files = fs.readdirSync(templateDirectory);
        files = files.filter(f => f.endsWith('.handlebars'))

        for (let file of files) {

            const filePath = path.join(templateDirectory, file)
            const contents = fs.readFileSync(filePath).toString();
            this.process(file, contents);
        }
    }

    parse<T, R>(name: string, templateData: T): R {
        const compileTemplate = this.templates[name];
        if (!compileTemplate) throw 'Template not found: ' + name;

        try {
            return compileTemplate(templateData);
        }
        catch (ex) {
            throw new Error(`Template invalid '${name}'. Message: "${ex}".`);
        }
    }

    addNamedTemplate(name: string, contents: string) {
        this.templates[name] = this.handlebars.compile(contents);
        this.handlebars.registerPartial(name, contents);
    }

    private process(fileName: string, contents: string) {

        const compileTemplate = this.handlebars.compile(contents);

        this.templates[fileName] = compileTemplate;
        this.handlebars.registerPartial(fileName, contents);

        const alternative = fileName.replace('.handlebars', '').replace('.hbs', '');
        this.templates[alternative] = compileTemplate;
        this.handlebars.registerPartial(alternative, contents);
    }

}

function readDir(directory: string) {
    return new Promise<string[]>((resolve, reject) => {
        fs.readdir(directory, (err, filenames) => {
            if (err)
                reject(err);
            else
                resolve(filenames);
        });
    });
}

function readFile(file: string) {
    return new Promise<Buffer>((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}