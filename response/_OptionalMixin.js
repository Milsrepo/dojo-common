define([
        "../../dojo/_base/declare"
        ], function(declare) {
// module:
//      backend/component/response/_OptionalMixin
    return declare([ ], {

        _optional: {},

        constructor: function () {
            try {
                this._optional = {};
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        // summary:
        //      This mixin is common for every response mixins
        //      who want to support be optional or not.
        isOptional: function (key) {
            // summary:
            //      overridable method for implement additional
            //      behavior, if some options must be optional.
            try {
                return !!this._optional[key];
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        optional: function (key) {
            // summary:
            //      mark response key as optional,
            //      so validator will not fail if this
            //      key will not present in response
            try {
                this._optional[key] = true;
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
        },

        required: function (key) {
            // summary:
            //      mark response key as required,
            //      so validator will fail if this
            //      key will not present in response
            try {
                this._optional[key] = false;
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        }
    });
});
