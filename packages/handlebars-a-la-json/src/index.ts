"use strict";

import decache from "decache";

decache("handlebars");
import { create as createDefaultHandlebars } from "handlebars"
decache("handlebars");

import { safeJsonParse } from "better-error-message-for-json-parse"
import { IHandlebars, ICompileOptions } from "./makeHandlebarsBehave";

export function escapeJson(str: any): string {
    str = str ? str.toString() : '';
    return str
        .replace(/\\/g, "\\\\")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/"/g, '\\"')
        .replace(/\r/g, "\\r");
}

export function createJsonHandlebars(): IHandlebars {
    const instance = createDefaultHandlebars();
    instance.Utils.escapeExpression = escapeJson;
    (<any>instance).create = createJsonHandlebars;
    (<any>instance).__def__compile = instance.compile;
    (<any>instance).compile = (input: any, options?: ICompileOptions) => {
        const compiled = (<any>instance).__def__compile(input, options);
        return (context: any, options: any): any => {
            
            let result = compiled(context, options);

            // replace enters
            result = result.replace('\r', '');

            // skip empty line
            result = result.split('\n').filter(l => !/^\s*$/.test(l)).join('\n');

            // replace lines that only have a comma - they are hard to debug
            result = result.replace(/\n\s*,\s*\n/g, ',\n');

            return safeJsonParse(result);
        };
    }
    return instance;
}