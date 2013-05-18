/*jslint nomen:true*/

/*globals YUI*/

YUI.add('mojito-alter-mojit', function (Y, NAME) {

    'use strict';

    Y.namespace('mojito.controllers')[NAME] = {

        index: function (ac) {
            this.__call(ac);
        },

        __call: function (ac) {

            var alters = [].concat(ac.config.get('alters')); // preserving

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
                    ac.composite._onChildFailure = tryNext;
                    ac.composite.execute(cfg, function (data, meta) {
                        if (data && Y.Lang.isString(data.child)) {
                            // we are good, and this flow ends here
                            // with a successful child
                            ac.done(data.child, meta);
                        } else {
                            // child fails, keep rolling
                            Y.log('Alter `' + child.base || ('@' + child.type) + '` failed.', 'debug', NAME);
                            tryNext();
                        }
                    });

                } else {

                    // nothing else in the queue, which means
                    // we should just fail big.
                    ac.error((new Error('No alter was successfully dispatched.')));

                }

            }

            if (!alters || !Y.Lang.isArray(alters)) {
                ac.error(new Error('Invalid `alter` configuration. The `array` ' +
                    'with the `alters` is required.'));
                return;
            }

            // to avoid changing the original array
            alters = [].concat(alters);

            // bounding the error handling to fallback to the next alter
            // ac._adapter.error = tryNext;

            tryNext();

        }

    };

}, '0.0.1', {requires: [
    'mojito',
    'mojito-config-addon',
    'mojito-composite-addon'
]});
