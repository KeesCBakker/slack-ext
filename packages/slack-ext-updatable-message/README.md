# Slack EXT: Updatable Message
Create awesome interactions with by updating your slack messages.

## Installation
Install it using NPM:
```shell
npm install --save slack-ext-updatable-message
```

## Usage
Usage is really easy. You can send anything you can send with the Slack API, we'll do the administration:
```js
const { UpdatableMessage } = require("slack-ext-updatable-message");

// provide us a token or an instance of the Slack Api and the channelId
const sender = new UpdatableMessage("token", channelId);

// send asynchronously
sender.send('Let me check...');

// perform long operations a send feeback
for(var i = 1; i < 10; i++){
    // long operation
    sender.send(`Procssing, we're on ${i}%`);
}

await sender.send('Finished!');
```

# Notes
There are some choices we've made:
- Awaiting is optional, but if you want to make sure something really happed, await it.
- If multiple updates come in when sending (without `await`), the last available message will be send upon completion.