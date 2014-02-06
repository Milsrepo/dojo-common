define([
        "dojo/_base/declare",
        "dojo/errors/RequestError",
        "./_OptionalMixin",
        "./_GetterMixin"
        ], function(declare, RequestError, _OptionalMixin, _GetterMixin) {
// module:
//      dojo-common/component/response/Status

    var _responseKey = 'status';

    return declare([ _OptionalMixin, _GetterMixin ], {
        // summary:
        //      This mixin should be used if response will support
        //      status

        status: null,

        constructor: function (data) {
            try {
                this.status = this.extractStatus(data);
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        getStatus: function (fallbackValue) {
            // summary:
            //      Return status from data object
            try {
                return this.defaultGetter(_responseKey);
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
        },

        isSuccess: function () {
            try {
                return this.status == 1;
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        isError: function () {
            try {
                return this.status === 0;
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        extractStatus: function (data) {
            // summary:
            //      Method for extracting message string
            //      from data
            try {
                data = data || {};
                if (data instanceof RequestError) {
                    if (data.response && data.response[_responseKey] != 200) {
                        return 0;
                    } else {
                        return 1;
                    }
                } else {
                    return typeof(data[_responseKey]) == 'undefined' ? null : data[_responseKey];
                }
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        }
    });
});
