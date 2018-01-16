# open-path

> Url path parser for OpenAPI.

## Install

```bash
$ npm i open-path
```

## Usage

```javascript
var Parse = require('open-path');
var parse = new Parse('/user/{category}/today/{tag}/detail');
// or
// var parse = new Parse('/user/:category/today/:tag/detail');

console.log(parse.path);
// prints: /user/{category}/today/{tag}/detail

// match
parse.match(ctx.path);  // returns params if matched or null

// build
parse.build({
    category: 'tech',
    tag: 'mobile'
});
// returns: /user/tech/today/mobile/detail
```