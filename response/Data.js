define([
        "dojo/_base/declare",
        "./_OptionalMixin",
        "./_GetterMixin"
        ], function(declare, _OptionalMixin, _GetterMixin) {
// module:
//      dojo-common/component/response/Data

    var _responseKey = 'data';

    return declare([ _OptionalMixin, _GetterMixin ], {
        // summary:
        //      This mixin should be used if response will support
        //      data

        data: null,

        constructor: function (data, opt) {
            try {
                this.data = this.extractData(data || {});
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
        },

        getData: function (fallbackValue) {
            // summary:
            //      Return data from data object
            try {
                return this.defaultGetter(_responseKey, fallbackValue);
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
        },


        extractData: function (data) {
            // summary:
            //      Method for extracting data
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
