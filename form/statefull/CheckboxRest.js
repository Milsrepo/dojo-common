define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/form/CheckBox",
    "common/proceed/_StandardResponseMixin",
    "dojo/request"
],
    function(declare, lang, on, CheckBox, _StandardResponseMixin, request){

        return declare("common.CheckboxRest", [ CheckBox, _StandardResponseMixin ], {

            _inProgress: true,

            postMixInProperties: function () {
                try {
                    if (!this.serviceUrl) {
                        throw "Service Url must be defined for checkbox REST";
                    }

                    this.inherited(arguments);
                } catch (e) {
                    console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                    throw e;
                }
            },

            postCreate: function () {
                try {
                    this.inherited(arguments);
                    this._inProgress = false;
                } catch (e) {
                     console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                     throw e;
                }
            },

            onSuccess: function (value) {},

            _handleOnChange: function (value) {
                try {
                    this.inherited(arguments);

                    if (this._inProgress) return;

                    this.set('disabled', true);
                    this._inProgress = true;

                    var formData = {};
                    formData[this.name] = value && 1 || 0;

                    request.put(this.serviceUrl,
                        {data: formData,
                         handleAs: 'json'})
                        .then(lang.hitch(this, this._onLoad, this.domNode),
                            lang.hitch(this, this._onError, this.domNode))
                        .then(lang.hitch(this, 'onSuccess', value))
                        .always(lang.hitch(this, function (){
                            this.set('disabled', false);
                            this._inProgress = false;
                        }));
                } catch (e) {
                     console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                     throw e;
                }
            }
        });
    });
