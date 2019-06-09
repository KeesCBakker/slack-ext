# Handlebars dir
Handlebars are nice! This package helps to read a directory as compile the `.handlebars` and `.hbs` files into templates. They can be references by their name (with and without extension). It also registers every file as partial, so it can be referenced from other files.

## Installation
Install it using NPM:
```shell
npm install --save handlebars-dir
```

## Usage
Use the `NamedTemplateParser` like to interact with the API:
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

// result
const result = parser.parse('main', { items: [{ name: 'Alpha' }, { name: 'Beta' }] });
```

## Manual input
You can also manually add named templates to the parser:
```js
// manual
parser.addNamedTemplate('main', 'This is a list: '+
'{{#items}}{{> include}}' + 
'{{#unless @last}}, {{/unless}}'+
'{{/items}}');
parser.addNamedTemplate('include', '{{name}}');
```
