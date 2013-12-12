define([
        "../../dojo/_base/declare",
        "./_OptionalMixin",
        "./_GetterMixin"
        ], function(declare, _OptionalMixin, _GetterMixin) {
// module:
//      backend/component/response/_MessageMixin

    var _responseKey = 'message';

    return declare([ _OptionalMixin, _GetterMixin ], {
        // summary:
        //      This mixin should be used if response will support
        //      messages

        message: null,

        constructor: function (data, opt) {
            try {
                this.message = this.extractMessage(data || {});
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
        },

        getMessage: function (fallbackValue) {
            // summary:
            //      Return message from data object
            try {
                return this.defaultGetter(_responseKey, fallbackValue);
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
        },


        extractMessage: function (data) {
            // summary:
            //      Method for extracting message string
            //      from data
            try {
               data = data || {};
               return data[_responseKey] || null;
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        }
    });
});
