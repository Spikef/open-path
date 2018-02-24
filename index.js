var TYPES = {
    STRING: 1,
    REGEXP: 2
};

/**
 * create path parse
 * @param {String|RegExp} path
 * @constructor
 */
function Parse(path) {
    if (!this instanceof Parse) throw new Error('Parse is a constructor, use new.');

    if (typeof path === 'string') {
        this.type = TYPES.STRING;
    } else if (path instanceof RegExp) {
        this.type = TYPES.REGEXP;
    } else {
        throw new Error('Argument path must be String or RegExp.');
    }

    var tokens = [];
    var params = [];
    var regexp = '';

    if (this.type === TYPES.STRING) {
        path.split(/(?=\/)/).forEach(function(p) {
            if (/^(?:(\/?)(?::([^*+?]+)|{(.+)})([*+?]?))$/.test(p)) {
                var p1 = RegExp.$1;
                var p2 = RegExp.$2 || RegExp.$3;
                var p3 = RegExp.$4;

                params.push(p2);
                tokens.push({
                    name: p2,
                    prefix: p1,
                    suffix: p3,
                    required: !p3 || p3 === '+'
                });

                if (p3 === '+' || p3 === '*') {
                    regexp += '(?:' + p1 + '((?:[^/]+)' + p3 + '(?:/[^/]+)*))' + p3 + '?';
                } else {
                    regexp += '(?:' + p1 + '([^/]+))' + p3;
                }
            } else {
                tokens.push(p);
                regexp += p;
            }
        });

        this.path = path.replace(/:([^/]+)/g, '{$1}').replace(/[?*+]/g, '');
        this.regexp = new RegExp('^' + regexp + '(?:/?)$', 'i');
    } else {
        this.path = path;
        this.regexp = path;
    }

    this.params = params;
    this.tokens = tokens;
}

Parse.prototype.match = function(path) {
    var matches;
    if (matches = path.match(this.regexp)) {
        var params = {};

        if (this.type === TYPES.STRING) {
            this.params.forEach(function(key, i) {
                var value = matches[i + 1];
                if (value !== undefined) {
                    params[key] = safeDecodeURIComponent(value);
                } else {
                    params[key] = value;
                }
            });
        } else if (this.type === TYPES.REGEXP) {
            matches.forEach(function(m, i) {
                params[i] = matches[i]
            });
        }

        return params;
    } else {
        return null;
    }
};

Parse.prototype.build = function(params) {
    return this.tokens.map(function(token) {
        if (typeof token === 'string') {
            return token;
        } else if (params[token.name] !== undefined) {
            return token.prefix + String(params[token.name]);
        } else if (token.required) {
            return token.prefix + 'undefined';
        } else {
            return '';
        }
    }).join('');
};

function safeDecodeURIComponent(input) {
    try {
        return decodeURIComponent(input);
    } catch (e) {
        return input;
    }
}

module.exports = Parse;