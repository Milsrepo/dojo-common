define([
    "dojo/_base/declare",
    "dojo/Deferred",
    "dojo-common/tooltip/AutohideTooltip"
], function(declare, Deferred, AutohideTooltip) {
    return declare("common.proceed._SimpleResponseMixin", null, {

        messageResponseSuccessful: 'Request successful.',
        messageResponseFailed: 'Unexpected error, please try again latter.',

        notShowSuccessNotification: false,
        notShowErrorNotification: false,

        /**
         * @param {string} data
         * @param {Node} messageNode
         * @protected
         */
        responseFailed: function (data, messageNode) {
            this.showMessage(this.messageResponseFailed, messageNode);
        },

        /**
         * @param {string} data
         * @param {Node} messageNode
         * @protected
         */
        responseSuccess: function (data, messageNode) {
            this.showMessage(this.messageResponseSuccessful, messageNode);
        },

        /**
         *
         * @param {string} message
         * @param {Node} messageNode
         * @protected
         */
        showMessage: function (message, messageNode) {
            try {
                messageNode && AutohideTooltip.show(message, messageNode);
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        /**
         * @protected
         * @param {string} response
         * @returns {boolean}
         */
        isValid: function (response) {
            try {
               return true;
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        /**
         * @param {Node} messageNode
         * @param {string} response
         * @returns {Deferred}
         * @protected
         */
        _onLoad: function (messageNode, response) {
            try {
                var def = new Deferred();

                if (this.isValid(response)) {
                    console.warn("Response success >>", response);

                    if (!this.notShowSuccessNotification) {
                        this.responseSuccess(response, messageNode);
                    }

                    def.resolve(response);
                } else {
                    console.warn("Response failed >>", response);

                    if (!this.notShowErrorNotification) {
                        this.responseFailed(response, messageNode);
                    }

                    def.reject("Response failed");
                }
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                this._onError(messageNode, e);
                throw e;
            }
            return def.promise;
        },

        /**
         * @param {Node} messageNode
         * @param {string} error
         * @returns {Deferred}
         * @protected
         */
        _onError: function (messageNode, error) {
            try {
                var def = new Deferred();
                console.error("Requesting backend finished with error: ", error);

                if (!this.notShowErrorNotification) {
                    this._showMessage(this.messageResponseFailed, messageNode);
                }

                def.reject("Response failed");
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
            return def.promise;
        }
    });
});
