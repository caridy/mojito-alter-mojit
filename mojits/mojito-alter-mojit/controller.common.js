/*jslint anon:true, nomen:true*/

/*globals YUI*/

YUI.add('mojito-alter-mojit', function (Y, NAME) {

    'use strict';

    /**
    The Alter mojit is an utility mojit that can be used to
    control the execution workflow of a series of mojits that
    might fail due to various reasons. When a child mojit fails
    the next child mojit will be used as an alternative option.

        {
            "specs": {
                "foo-or-bar-or-baz": {
                    "type": "mojito-alter-mojit",
                    "config": {
                        "alters": [
                            {
                                "type": "foo",
                                "config": {}
                            },
                            {
                                "type": "bar",
                                "config": {}
                            },
                            {
                                "type": "baz",
                                "config": {}
                            }
                        ]
                    }
                }
            }
        }

    In the example above, `foo` child will be executed first,
    if it fails by calling `ac.error()` or by throwing an
    error, `bar` will be executed next, and the same principle
    applies. If `bar` and `baz` also fail, `ac.error` will be
    issued to finalize the execution of this mojit.

    This mojit does not have view associated, and it will just
    return the response from the success child when available.

    @module mojito-alter-mojit
    @requires mojito-config-addon, mojito-composite-addon
    **/

    /**
    Constructor for the Controller class.

    @class Y.mojito.controllers['mojito-alter-mojit']
    @static
    @constructor
    **/
    Y.namespace('mojito.controllers')[NAME] = {

        /**
        Default action `index` responsible for implement
        the `alt` pattern where each child will be executed
        at a time in a form of an sync queue. The first child
        to respond with a valid answer will be the winner, and
        the rest of the execution will be halted. The response
        of the success child will become the final response.

        @method index
        @param {Object} ac The ActionContext that provides access
                to the Mojito API.
        **/
        index: function (ac) {
            this.__call(ac);
        },

        __call: function (ac) {

            var alters = ac.config.get('alters');

            function tryNext() {

                var child = alters.shift(),
                    cfg;

                if (child) {

                    // Map the action to the child if the action
                    // is not specified as part of the child config.
                    child.action = child.action || ac.action;

                    // a child should propagate any failure so
                    // we can control the flow.
                    child.propagateFailure = true;

                    // Create a config object for the composite addon
                    cfg = {
                        children: {
                            child: child
                        }
                    };

                    // Now execute the child as a composite
                    ac.composite.execute(cfg, function (data, meta) {
                        if (data && Y.Lang.isString(data.child)) {
                            // we are good, and this flow ends here
                            // with a successful child
                            ac.done(data.child, meta);
                        } else {
                            // child fails, keep rolling
                            Y.log('Child `' + child.base || child.type + '` of `' +
                                ac.instance.type + '` failed.', 'debug', NAME);
                            tryNext();
                        }
                    });

                } else {

                    // nothing else in the queue, which means
                    // we should just fail big.
                    ac.error(new Error('No child was successfully dispatched as ' +
                        'part of the `alter` process.'));

                }

            }

            if (!alters || !Y.Lang.isArray(alters)) {
                ac.error(new Error('Invalid `alter` configuration. The `array` ' +
                    'with the `alters` is required.'));
                return;
            }

            // to avoid changing the original array
            alters = [].concat(alters);

            tryNext();

        }

    };

}, '0.0.1', {requires: [
    'mojito',
    'mojito-config-addon',
    'mojito-composite-addon'
]});
