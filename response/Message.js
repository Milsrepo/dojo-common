define([
        "dojo/_base/declare",
        "./processor/DataMessages",
        "./_OptionalMixin",
        "./_GetterMixin",
        "./_JsonifyMixin"
        ], function(declare, ProcessorDataMessages, _OptionalMixin, _GetterMixin, _JsonifyMixin) {
// module:
//      dojo-common/component/response/Message

    var _responseKey = 'message';
    var _aliasKey = 'messages';

    return declare([ _OptionalMixin, _GetterMixin, _JsonifyMixin ], {
        // summary:
        //      This mixin should be used if response will support
        //      messages

        message: null,

        constructor: function (data, opt) {
            try {
                this.message = this.extractMessage(data || {});
            } catch (e) {
                console.error(this.declaredClass + " " + arguments.callee.nom, arguments, e);
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
               var resp, result, idx, message = [];
               data = this.jsonify(data || {});
               resp = data[_responseKey] || null;
               if (resp === null) {
                   resp = data[_aliasKey] || null;
               }

               return ProcessorDataMessages.process(resp).toString();
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        }
    });
});
