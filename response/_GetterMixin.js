define([
        "dojo/_base/declare",
        "./_OptionalMixin"
        ], function(declare, _OptionalMixin) {
// module:
//      dojo-common/component/response/_GetterMixin
    return declare([ _OptionalMixin ], {
         defaultGetter: function (key, fallbackValue) {
             // summary:
             //      Default getter to get values and check is they are
             //      optional or not , and adding behaviour, if fallbackValue
             //      is defined and value is optional then will be return fallbackValue
             //      if value will not be found in response.
             try {

                 var notExists = (this[key] === null);

                 if (notExists && !(this.isOptional && this.isOptional(key))) {
                     throw "["+key+"] must be defined in Response but could not be found";
                 }

                 if (notExists && typeof(fallbackValue) != 'undefined') {
                     return fallbackValue;
                 }

                 return this[key]; // String
             } catch (e) {
                  console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                  throw e;
             }
         }
    });
});
