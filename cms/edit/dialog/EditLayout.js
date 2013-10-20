define([
    "dojo/_base/declare", 
    "dojo/_base/lang",
    "dijit/_Widget",
    "dijit/_Container",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/request",
    "dojo/keys",
    "dojo/on",
    "mils/tooltip/AutohideTooltip",
    "mils/proceed/_StandardResponseMixin",
    "dojo/text!./templates/EditLayout.html",
    "mils/form/ValidationTextBox",
    "mils/form/BusyButton"
], function(declare, lang,  _Widget, _Container,
            _TemplatedMixin, _WidgetsInTemplateMixin, 
            request, keys, on, AutohideTooltip,
            _StandardResponseMixin, template) {
    
    return declare('mils.cms.edit.dialog.EditLayout',
                   [ _Widget, _Container, _TemplatedMixin,
                     _WidgetsInTemplateMixin, _StandardResponseMixin ], {

        templateString: template,

        messages: {'title': 'Edit Layout',
                   'save': 'Save'},

        title: '',
        actionUrl: '',
        dialog: null,
        method: 'put',

        postCreate: function() {
            try {
                console.warn(this.dialog, this.messages, this.messages.title);
                this.dialog.attr('title', this.messages.title);
                this.inherited(arguments);
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
        },

        registerEnterToSubmit: function (nodeForRegister) {
            try {
                on(nodeForRegister, "keypress", lang.hitch(this, function(evt){
                    var charOrCode = evt.charCode || evt.keyCode;

                    if (charOrCode == keys.ENTER) {
                        this._save();
                    }
                }));
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        closeWhenHideTooltip: function () {
            try {
                var subs = this.subscribe('AutoHideTooltip-hide', function (){
                    subs && this.unsubscribe(subs);
                    this.dialog && this.dialog.hide();
                });

                setTimeout(lang.hitch(this, function (){
                    AutohideTooltip.hide(this.saveWidget.domNode);
                }), 500);
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        grabData: function () {
            throw "Abstract method must be override";
        },

        _save: function (e) {
            try {
                this.saveWidget.makeBusy();
                var formData = this.grabData();

                if (!formData) {
                    this.saveWidget.cancel();
                    return false;
                }

                if (this._inProgress) return;
                this._inProgress = true;

                request[this.method](this.actionUrl,
                             {data: formData,
                              handleAs: 'json'})
                       .then(lang.hitch(this, this._onLoad, this.saveWidget.domNode),
                             lang.hitch(this, this._onError, this.saveWidget.domNode))
                       .then(lang.hitch(this, 'onSuccess'))
                       .always(lang.hitch(this, function (){
                           this.saveWidget.cancel();
                           this._inProgress = false;
                        }));
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
        },

        onSuccess: function (response) {},

        onChanged: function (value) {}
    });
});