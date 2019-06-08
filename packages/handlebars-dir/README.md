# Handlebars dir
Handlebars are nice! This package will take a directory and compile so it can be used as templates.

## Usage

```
const { create } = "handlebars-a-la-json";

const handlebars = create();
const template = `{ "message": "Hello {{name}}!" }`;
const data = { name: 'Quinton "Rampage" Jacksons' };
const compiledTemplate = handlebars.compile(template);
        const actual = compiledTemplate(data) as any;
```