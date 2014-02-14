define([
        "dojo/_base/declare",
        "dojo/json"
        ], function(declare, json) {
// module:
//      dojo-common/component/response/_JsonifyMixin
    return declare([ ], {

         jsonify: function (data) {
             // summary:
             //      Method will receive data understand if it is object or not
             //      and if it is regular text method will try to convert to json
             //      if action will fail, then will be returned given data.
             try {
                 if (typeof(data) != 'string') {
                     return data;
                 }

                 try {
                    return json.parse(data);
                 } catch (e) {
                     console.error("Could not parse data in response");
                     return data;
                 }
             } catch (e) {
                  console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                  throw e;
             }
         }

    });
});
