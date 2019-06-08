# Handlebars dir
Handlebars are nice! This package will take a directory and compile so it can be used as templates.

## Installation
Install it using NPM:
```shell
npm install --save handlebars-dir
```

## Usage
Use the `NamedTemplateParser` like this.
```js
const Handlebars = require("handlebars");
const { NamedTemplateParser } = require("handlebars-dir");

// load it on its own scope
const hb = Handlebars.create();
const parser = new NamedTemplateParser(hb);

// sync
parser.loadTemplatesFromDirectorySync('./my-directory/');

// async

await parser.loadTemplatesFromDirectory('./test/templates/');

// manual
parser.addNamedTemplate('main', 'This is a list: {{#items}}{{> include}}{{#unless @last}}, {{/unless}}{{/items}}');
parser.addNamedTemplate('include', '{{name}}');

// result
const result = parser.parse('main', { items: [{ name: 'Alpha' }, { name: 'Beta' }] });
```