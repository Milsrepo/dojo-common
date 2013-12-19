define([
    "dojo/_base/declare",
    "./_SimpleResponseMixin",
    "dojo-common/response/_MessageMixin",
    "dojo-common/response/_StatusMixin"
], function(declare, _SimpleResponseMixin, _MessageMixin, _StatusMixin) {
    return declare("common.proceed._StandardResponseMixin", [_SimpleResponseMixin], {

        messageResponseSuccessful: 'Data successfully saved.',
        messageResponseFailed: 'Unexpected error, please try again latter.',

        constructor: function () {
            try {
                this._responseService = null;
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        responseFailed: function (data, messageNode) {
            this.showMessage(this._responseService.getMessage(this.messageResponseFailed),
                             messageNode);
        },
        
        responseSuccess: function (data, messageNode) {
            this.showMessage(this._responseService.getMessage(this.messageResponseSuccessful),
                             messageNode);
        },

        isValid: function (response) {
            try {
                this._responseService = new declare([_MessageMixin, _StatusMixin])(response);

                this._responseService.optional('message');

                try {
                    return this._responseService.isSuccess();
                } catch (e) {
                    return false;
                }
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        }
    });
});
