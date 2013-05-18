YUI.add('baz', function (Y, NAME) {

    Y.namespace('mojito.controllers')[NAME] = {

        index: function (ac) {
            ac.done({
                tagline: 'baz mojit instance should be rendered correctly!'
            });
        }

    };

});