define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/dom-style",
    "dojo/on",
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "./DestroyableDialog",
    "dojo/text!./templates/ConfirmDialog.html",
    'dojo/i18n!./nls/Dialog'
], function(declare, lang, win, domStyle, on, _Widget, _TemplatedMixin,
            _WidgetsInTemplateMixin, DestroyableDialog, template, translations) {

    var Content = declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        message: '',
        okLabel: '',
        cancelLabel: '',

        onOk: function () {},
        onCancel: function () {}
    });

    return declare('dialog.ConfirmDialog',
                   [ DestroyableDialog ], {

            title: translations['confirmTitle'],
            message: translations['confirmMessage'],
            okLabel: translations['okButtonLabel'],
            cancelLabel: translations['cancelButtonLabel'],
            maxRatio: 0.4,

            postMixInProperties: function() {
                this.inherited(arguments);

                this.content = new Content({message: this.message,
                                            okLabel: this.okLabel,
                                            cancelLabel: this.cancelLabel});
                this.content.startup();
            },

            postCreate: function() {

                this.inherited(arguments);

                this.content.on('cancel', lang.hitch(this, 'onCancel'));
                this.content.on('ok', lang.hitch(this, 'onOk'));
            },

            onOk: function () {
                this.hide();
            }
    });
});
