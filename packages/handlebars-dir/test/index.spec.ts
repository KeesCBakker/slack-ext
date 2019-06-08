"use strict";

import { expect } from "chai";
import { create as createDefaultHandlebars } from "handlebars"
import { NamedTemplateParser } from '../src'


describe("Templating", () => {

    it("Parse directory sync", () => {

        // arrange
        const handlebars = createDefaultHandlebars();
        const parser = new NamedTemplateParser(handlebars);
        parser.loadTemplatesFromDirectorySync('./test/templates/');

        // act
        const actual = parser.parse('main', { items: [{ name: 'Alpha' }, { name: 'Beta' }] });

        // assert
        const expected = `This is a list: Alpha, Beta`;
        expect(actual).to.eq(expected);
    });


    it("Parse directory async", async () => {

        // arrange
        const handlebars = createDefaultHandlebars();
        const parser = new NamedTemplateParser(handlebars);
        await parser.loadTemplatesFromDirectory('./test/templates/');

        // act
        const actual = parser.parse('main', { items: [{ name: 'Alpha' }, { name: 'Beta' }] });

        // assert
        const expected = `This is a list: Alpha, Beta`;
        expect(actual).to.eq(expected);
    });

    it("Manually added", () => {

        // arrange
        const handlebars = createDefaultHandlebars();
        const parser = new NamedTemplateParser(handlebars);
        parser.addNamedTemplate('main', 'This is a list: {{#items}}{{> include}}{{#unless @last}}, {{/unless}}{{/items}}');
        parser.addNamedTemplate('include', '{{name}}');

        // act
        const actual = parser.parse('main', { items: [{ name: 'Alpha' }, { name: 'Beta' }] });

        // assert
        const expected = `This is a list: Alpha, Beta`;
        expect(actual).to.eq(expected);
    });

});
