var assert = require('assert');

var Parse = require('../index');
var parse1 = new Parse('/user/:category/today/{tag}?/detail');
var parse2 = new Parse('/page/:id?');
var parse3 = new Parse('/html/:filename*');
var parse4 = new Parse('/file/:filename+');

describe('Path resolve', function () {
    it('path should be [/user/{category}/today/{tag}/detail]', function () {
        assert.deepEqual('/user/{category}/today/{tag}/detail', parse1.path);
    });
});

describe('Path match', function () {
    it('[/user/tech/today/mobile/detail] should matched', function () {
        assert.deepEqual({
            category: 'tech',
            tag: 'mobile'
        }, parse1.match('/user/tech/today/mobile/detail'));
    });

    it('[/user/tech/today/detail/detail] should matched', function () {
        assert.deepEqual({
            category: 'tech',
            tag: 'detail'
        }, parse1.match('/user/tech/today/detail/detail'));
    });

    it('[/user/tech/today/detail] should matched', function () {
        assert.deepEqual({
            category: 'tech',
            tag: undefined
        }, parse1.match('/user/tech/today/detail'));
    });

    it('[/user/tech/today] should not matched', function () {
        assert.deepEqual(null, parse1.match('/user/tech'));
    });
});

describe('Path build', function () {
    it('path should be [/user/tech/today/mobile/detail]', function () {
        assert.deepEqual('/user/tech/today/mobile/detail', parse1.build({
            category: 'tech',
            tag: 'mobile'
        }));
    });

    it('path should be [/user/tech/today/mobile/detail]', function () {
        assert.deepEqual('/user/undefined/today/detail', parse1.build({}));
    });
});

describe('Path match with ?', function () {
    it('[/page] should matched', function () {
        assert.deepEqual({
            id: undefined
        }, parse2.match('/page'));
    });

    it('[/page/1] should matched', function () {
        assert.deepEqual({
            id: 1
        }, parse2.match('/page/1'));
    });

    it('[/page/1/2] should not matched', function () {
        assert.deepEqual(null, parse2.match('/page/1/2'));
    });
});

describe('Path match with *', function () {
    it('[/html] should matched', function () {
        assert.deepEqual({
            filename: undefined
        }, parse3.match('/html'));
    });

    it('[/html/] should matched', function () {
        assert.deepEqual({
            filename: undefined
        }, parse3.match('/html/'));
    });

    it('[/html/lib/] should matched', function () {
        assert.deepEqual({
            filename: 'lib'
        }, parse3.match('/html/lib/'));
    });

    it('[/html/index.js] should matched', function () {
        assert.deepEqual({
            filename: 'index.js'
        }, parse3.match('/html/index.js'));
    });

    it('[/html/lib/index.js] should matched', function () {
        assert.deepEqual({
            filename: 'lib/index.js'
        }, parse3.match('/html/lib/index.js'));
    });

    it('[/html/lib/images/avatar.png] should matched', function () {
        assert.deepEqual({
            filename: 'lib/images/avatar.png'
        }, parse3.match('/html/lib/images/avatar.png'));
    });
});

describe('Path match with +', function () {
    it('[/file] should not matched', function () {
        assert.deepEqual(null, parse4.match('/file'));
    });

    it('[/file/] should not matched', function () {
        assert.deepEqual(null, parse4.match('/file/'));
    });

    it('[/file/images/] should matched', function () {
        assert.deepEqual({
            filename: 'images'
        }, parse4.match('/file/images/'));
    });

    it('[/file/avatar.png] should matched', function () {
        assert.deepEqual({
            filename: 'avatar.png'
        }, parse4.match('/file/avatar.png'));
    });

    it('[/file/images/avatar.png] should matched', function () {
        assert.deepEqual({
            filename: 'images/avatar.png'
        }, parse4.match('/file/images/avatar.png'));
    });
});