function Parse(path) {
    if (typeof path !== 'string') throw new Error('Argument path must be string.');
    if (!this instanceof Parse) throw new Error('Parse is a constructor, use new.');

    var tokens = [];
    var params = [];
    var regexp = '';

    path.split(/(?=\/)/).forEach(function(p) {
        if (/^(?:(\/?)(?::([^?]+)|{(.+)})(\??))$/.test(p)) {
            var p1 = RegExp.$1;
            var p2 = RegExp.$2 || RegExp.$3;
            var p3 = RegExp.$4;

            params.push(p2);
            tokens.push({
                name: p2,
                prefix: p1,
                required: !p3
            });
            regexp += '(?:' + p1 + '([^/]+))' + p3;
        } else {
            tokens.push(p);
            regexp += p;
        }
    });

    this.path = path.replace(/:([^/]+)/g, '{$1}').replace(/\?/g, '');
    this.params = params;
    this.tokens = tokens;
    this.regexp = new RegExp('^' + regexp + '$', 'i');
}

Parse.prototype.match = function(path) {
    var matches;
    if (matches = path.match(this.regexp)) {
        var params = {};
        this.params.forEach(function(key, i) {
            params[key] = matches[i + 1];
        });

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

module.exports = Parse;