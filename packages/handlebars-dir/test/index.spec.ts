"use strict";

import { expect } from "chai";
import { create as createDefaultHandlebars } from "handlebars"
import { escapeJson, createJsonHandlebars } from "../src";


describe("escaping", () => {

    it("escape enters", () => {
        // arrange
        const txt = "This\nis\nso\ncool!"

        // act
        const actual = escapeJson(txt);

        // assert
        expect(actual).to.equal("This\\nis\\nso\\ncool!");
    });

    it("escape quotes", () => {

        // arrange
        const txt = 'Einstein: "Uasually I\'m misquoted."';

        // act
        const actual = escapeJson(txt);

        // assert
        expect(actual).to.equal("Einstein: \\\"Uasually I\'m misquoted.\\\"");
    });

});

describe("create", () => {

    it("Parse simple JSON template", () => {

        // arrange
        const handlebars = createJsonHandlebars();
        const template = JSON.stringify({ "message": "Hello {{name}}!" })
        const data = { name: "World" };

        // act
        const compiledTemplate = handlebars.compile(template);
        const actual = compiledTemplate(data) as any;

        // assert
        expect(actual).not.to.be.null;
        expect(actual.message).to.equal('Hello World!');
    });

    it("Parse simple JSON template with quotes", () => {

        // arrange
        const handlebars = createJsonHandlebars();
        const template = `{ "message": "Hello {{name}}!" }`;
        const data = { name: 'Quinton "Rampage" Jacksons' };

        // act
        const compiledTemplate = handlebars.compile(template);
        const actual = compiledTemplate(data) as any;

        // assert
        expect(actual).not.to.be.null;
        expect(actual.message).to.equal('Hello Quinton "Rampage" Jacksons!');
    });

    it("Parse with create", ()=>{

        // arrange
        const handlebars = createJsonHandlebars().create();
        const template = `{ "message": "Hello {{name}}!" }`;
        const data = { name: 'Quinton "Rampage" Jacksons' };

        // act
        const compiledTemplate = handlebars.compile(template);
        const actual = compiledTemplate(data) as any;

        // assert
        expect(actual).not.to.be.null;
        expect(actual.message).to.equal('Hello Quinton "Rampage" Jacksons!');
    });

    it("Default handlebars should not be affected.", ()=>{

        // arrange
        const json = createJsonHandlebars()
        const standard = createDefaultHandlebars();
        const template = `{ "message": "Hello {{name}}!" }`;
        const data = { name: 'Quinton "Rampage" Jacksons' };

         // act
         const compiledTemplate = standard.compile(template);
         const actual = compiledTemplate(data) as any;

         // assert
        expect(actual, "Actual should be an object that has HTML escaped strings.").to.equal(`{ "message": "Hello Quinton &quot;Rampage&quot; Jacksons!" }`);
    });

});

describe("error handling", () => {

    it("forget a comma in an arry", () => {

        // arrange
        const handlebars = createJsonHandlebars();
        const template = `{
            "blocks": [
                {{#items}}
                { "message": "Hello {{name}}!" }
                {{/items}}
            ]
        }`;
        const data = { items: [{ name: "Alpha" }, { name: "Beta" }] };

        // act
        const compiledTemplate = handlebars.compile(template);
        try {
            compiledTemplate(data);
        }
        catch (ex) {
            expect(ex.toString()).to.equal(`SyntaxError: Unexpected token { in JSON at position 88
3:                 { "message": "Hello Alpha!" }
4:                 { "message": "Hello Beta!" }
------------------^
5:             ]`);
        }
    });

});