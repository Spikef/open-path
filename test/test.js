var assert = require('assert');

var Parse = require('../index');
var parse = new Parse('/user/:category/today/{tag}?/detail');

describe('Path resolve', function () {
    it('path should be [/user/{category}/today/{tag}/detail]', function () {
        assert.deepEqual('/user/{category}/today/{tag}/detail', parse.path);
    });
});

describe('Path match', function () {
    it('[/user/tech/today/mobile/detail] should matched', function () {
        assert.deepEqual({
            category: 'tech',
            tag: 'mobile'
        }, parse.match('/user/tech/today/mobile/detail'));
    });

    it('[/user/tech/today/detail/detail] should matched', function () {
        assert.deepEqual({
            category: 'tech',
            tag: 'detail'
        }, parse.match('/user/tech/today/detail/detail'));
    });

    it('[/user/tech/today/detail] should matched', function () {
        assert.deepEqual({
            category: 'tech',
            tag: undefined
        }, parse.match('/user/tech/today/detail'));
    });

    it('[/user/tech/today] should not matched', function () {
        assert.deepEqual(null, parse.match('/user/tech'));
    });
});

describe('Path build', function () {
    it('path should be [/user/tech/today/mobile/detail]', function () {
        assert.deepEqual('/user/tech/today/mobile/detail', parse.build({
            category: 'tech',
            tag: 'mobile'
        }));
    });

    it('path should be [/user/tech/today/mobile/detail]', function () {
        assert.deepEqual('/user/undefined/today/detail', parse.build({}));
    });
});