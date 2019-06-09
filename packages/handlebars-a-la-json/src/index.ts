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

export interface ITemplateDelegate<T = any> {
    (context: T, options?: RuntimeOptions): string;
}

export interface IHandlebars {
    create(): IHandlebars;
    compile<T = any>(input: any, options?: CompileOptions): ITemplateDelegate<T>;
}

export interface ICompileOptions {
    data?: boolean;
    compat?: boolean;
    knownHelpers?: {
        helperMissing?: boolean;
        blockHelperMissing?: boolean;
        each?: boolean;
        if?: boolean;
        unless?: boolean;
        with?: boolean;
        log?: boolean;
        lookup?: boolean;
    };
    knownHelpersOnly?: boolean;
    noEscape?: boolean;
    strict?: boolean;
    assumeObjects?: boolean;
    preventIndent?: boolean;
    ignoreStandalone?: boolean;
    explicitPartialContext?: boolean;
  }
  


export function createJsonHandlebars(): IHandlebars {
    const instance = createDefaultHandlebars();
    instance.Utils.escapeExpression = escapeJson;
    (<any>instance).create = createJsonHandlebars;
    (<any>instance).__def__compile = instance.compile;
    (<any>instance).compile = (input: any, options?: ICompileOptions) => {
        const compiled = (<any>instance).__def__compile(input, options);
        return (context: any, options: any): any => {
            const result = compiled(context, options);
            return safeJsonParse(result);
        };
    }
    return instance;
}