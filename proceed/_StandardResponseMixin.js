define([
    "dojo/_base/declare",
    "./_SimpleResponseMixin"
], function(declare, _SimpleResponseMixin) {
    return declare("common.proceed._StandardResponseMixin", [_SimpleResponseMixin], {

        messageResponseSuccessful: 'Data successfully saved.',
        messageResponseFailed: 'Unexpected error, please try again latter.',

        
        responseFailed: function (data, messageNode) {
            var message = this.messageResponseFailed;
            if (data.message) {
                message = data.message;
            }

            this.showMessage(message, messageNode);
        },
        
        responseSuccess: function (data, messageNode) {
            var message = this.messageResponseSuccessful;
            if (data.message) {
                message = data.message;
            }

            this.showMessage(message, messageNode);
        },

        isValid: function (response) {
            try {
                return response && response.status && (response.status === 1 || response.status === 'success');
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        }
    });
});