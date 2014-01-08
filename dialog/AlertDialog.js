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
    "dojo/text!./templates/AlertDialog.html",
    'dojo/i18n!./nls/Dialog'
], function(declare, lang, win, domStyle, on, _Widget, _TemplatedMixin,
            _WidgetsInTemplateMixin, DestroyableDialog, template, translations) {

    var Content = declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        message: '',
        okLabel: '',

        onCancel: function () {}
    });

    return declare('dialog.AlertDialog',
                   [ DestroyableDialog ], {

            title: translations['alertTitle'],
            message: translations['alertMessage'],
            okLabel: translations['okButtonLabel'],
            maxRatio: 0.3,

            postMixInProperties: function() {
                this.inherited(arguments);

                this.content = new Content({message: this.message,
                                            okLabel: this.okLabel});
                this.content.startup();
            },

            postCreate: function() {
                this.inherited(arguments);
                this.content.on('cancel', lang.hitch(this, 'onCancel'));
            }
    });
});
