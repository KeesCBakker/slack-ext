"use strict";

import decache from "decache";

decache("handlebars");
import { create as createDefaultHandlebars } from "handlebars"
decache("handlebars");

import { safeJsonParse } from "better-error-message-for-json-parse"

export function escapeJson(str: any): string {
    str = str ? str.toString() : '';
    return str
        .replace(/\\/g, "\\\\")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/"/g, '\\"')
        .replace(/\r/g, "\\r");
}

export function createJsonHandlebars() {
    const instance = createDefaultHandlebars();
    instance.Utils.escapeExpression = escapeJson;
    (<any>instance).create = createJsonHandlebars;
    (<any>instance).__def__compile = instance.compile;
    (<any>instance).compile = (input: any, options?: CompileOptions) => {
        const compiled = (<any>instance).__def__compile(input, options);
        return (context: any, options: any): any => {
            const result = compiled(context, options);
            return safeJsonParse(result);
        };
    }
    return instance;
}