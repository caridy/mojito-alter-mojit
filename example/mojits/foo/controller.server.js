YUI.add('foo', function (Y, NAME) {

    Y.namespace('mojito.controllers')[NAME] = {

        index: function (ac) {
            throw new Error('`foo` mojit is meant to throw.');
        }

    };

});