define([
        "dojo/_base/declare",
        "dojo/errors/RequestError",
        "./_OptionalMixin",
        "./_GetterMixin",
        "./_JsonifyMixin"
        ], function(declare, RequestError, _OptionalMixin, _GetterMixin, _JsonifyMixin) {
// module:
//      dojo-common/component/response/Status

    var _responseKey = 'status';

    return declare([ _OptionalMixin, _GetterMixin, _JsonifyMixin ], {
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
                return this.status === 1;
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
                data = this.jsonify(data || {});
                if (data instanceof RequestError || data instanceof Error) {
                    if (data.response && data.response[_responseKey] === 200) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    return typeof(data[_responseKey]) === 'undefined' ? null : data[_responseKey];
                }
            } catch (e) {
                 console.error(this.declaredClass + " " + arguments.callee.nom, arguments, e);
                 throw e;
            }
        }
    });
});
