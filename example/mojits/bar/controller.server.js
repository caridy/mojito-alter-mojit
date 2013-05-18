YUI.add('bar', function (Y, NAME) {

    Y.namespace('mojito.controllers')[NAME] = {

        index: function (ac) {
            ac.error(new Error('`bar` mojit fails by calling ac.error().'));
        }

    };

});