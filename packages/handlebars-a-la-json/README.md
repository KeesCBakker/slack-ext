# Handlebars a la JSON
Handlebars is a great and simple templating engine for generating HTML. But what if you need to generate JSON? That's what this package does.

## Usage
You basically instantiate the handler and use it. Instead of a string it will return a JSON object.
```js
const { createJsonHandlebars } = "handlebars-a-la-json";

// instantiate JSON version
const handlebars = createJsonHandlebars();

// compile the template
const template = `{ "message": "Hello {{name}}!" }`;
const compiledTemplate = handlebars.compile(template);

// execute the template
const data = { name: 'Quinton "Rampage" Jacksons' };
const obj = compiledTemplate(data);

// obj.message == 'Hello Quinton "Rampage" Jacksons!'
```

## Error handling
It is really easy to create invalid JSON when you are templating. To make things easier, we've included better error message.

This code:
```js
const handlebars = createJsonHandlebars();
const template = `{
  "blocks": [
    {{#items}}
    { "message": "Hello {{name}}!" }
    {{/items}}
]}`;
const data = { items: [{ name: "Alpha" }, { name: "Beta" }] };
const compiledTemplate = handlebars.compile(template);
compiledTemplate(data);
```
Will generate the following exception information:
> SyntaxError: Unexpected token { in JSON at position 88
> 3:    { "message": "Hello Alpha!" }
> 4:    { "message": "Hello Beta!" }
> -----^
> 5:  ]
This will help you debug.