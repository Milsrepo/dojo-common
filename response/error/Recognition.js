define([
        "dojo/_base/declare",
        "dojo/errors/RequestError",
        "dojo/errors/CancelError",
        "dojo/errors/RequestTimeoutError"
        ], function(declare, RequestError, CancelError, RequestTimeoutError) {
// module:
//      dojo-common/component/response/error/Recognition

    return declare([ ], {
        // summary:
        //      This service provide information if, error
        //      might be handled automatically or not.

        _canRetire: false,

        constructor: function (data) {
            // summary:
            //      Constructor, will analyze if data has error
            //      and it is recoverable or retirable.

            try {
                data = data || {};

                if (data instanceof RequestTimeoutError ||
                    data instanceof CancelError) {
                    this._canRetire = true;
                }
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
        },

        isRetirable: function () {
            try {
                return this._canRetire;
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        }
    });
});
