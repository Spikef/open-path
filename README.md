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

## Parameters

The path argument is used to define parameters.

### Named Parameters

Named parameters are defined by prefixing a colon to the parameter name (:foo) or surround with braces ({foo}). By default, the parameter will match until the following path segment.

### Parameter Modifiers

#### Optional

Parameters can be suffixed with a question mark (?) to make the parameter optional.

```javascript
var parse = new Parse('/:foo/:bar?');
```

#### Zero or more

Parameters can be suffixed with an asterisk (*) to denote a zero or more parameter matches. The prefix is taken into account for each match.

```javascript
var parse = new Parse('/:foo*');
```

#### One or more

Parameters can be suffixed with a plus sign (+) to denote a one or more parameter matches. The prefix is taken into account for each match.

```javascript
var parse = new Parse('/:foo+');
```