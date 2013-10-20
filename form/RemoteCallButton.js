define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/request",
    "../tooltip/AutohideTooltip",
    "../proceed/_SimpleResponseMixin",
    "./BusyButton"
], function(declare, lang, request, AutohideTooltip, _StandardResponseMixin, BusyButton){
    return declare("common.form.RemoteCallButton", [BusyButton, _StandardResponseMixin], {
            actionUrl: '',
            messageResponseSuccessful: 'Действие выполнено успешно',
            messageResponseFailed: 'Не удалось выполнить действие',

            onClick: function () {
                try {
                    request.get(this.actionUrl, {handleAs: 'text'})
                           .then(lang.hitch(this, '_onLoad', this.domNode),
                                 lang.hitch(this, '_onError', this.domNode))
                           .then(lang.hitch(this, 'onSuccess'),
                                 lang.hitch(this, 'onFail'))
                           .always(lang.hitch(this, 'cancel'));
                } catch (e) {
                     console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                     throw e;
                }
            },

            onSuccess: function () {},
            onFail: function () {}
    });
});
