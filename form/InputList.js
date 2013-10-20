define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/on",
    "dojo/dom-class",
    "dijit/_Widget",
    "dijit/_Container",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "put-selector/put",
    "dijit/form/_FormValueWidget",
    "dojo/text!./templates/InputList.html",
    "dojo/text!./templates/InputListItem.html"
], 
function(declare, lang, array, on, domClass, _Widget, _Container, _TemplatedMixin, _WidgetsInTemplateMixin,
         put, _FormValueWidget,
         templateList, templateListItem){

    var _InputItem = declare("mils.form.InputListItem", [ _Widget, _Container, _TemplatedMixin ], {

        templateString: templateListItem,
        removeControl: true,

        messages: {
            'removeLabel': 'Remove'
        },

        postMixInProperties: function () {
            try {
                console.log(this.getChildren());

                if (!this.fields || !this.field instanceof Array) {
                    throw "Fields must be defined";
                }
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        postCreate: function () {
            try {

                if (!this.removeControl) {
                    put(this.removeNode, '[style="display:none;"]');
                }

                array.forEach(this.fields, function (field) {
                    if (field['w']) {
                        var obj = new field['w'](field['args'] || {},
                                                 put('div'));
                    } else {
                        throw "Invalid field ["+field+"]";
                    }

                    this.addChild(obj);
                }, this);
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        _setValueAttr: function (value) {
            try {
                var parts = value.split(':');
                array.forEach(this.getChildren(), function(child, k){
                    if (typeof parts[k] != 'undefined') {
                        child.attr('value', parts[k]);
                    }
                });
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        _getValueAttr: function () {
            try {
                 return array.map(this.getChildren(), function (child) {return child.attr('value');}).join(':');
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        onRemove: function () {}
    });


    return declare("mils.form.InputList", [ _Widget, _Container, _TemplatedMixin,
                                               _FormValueWidget ], {

        templateString: templateList,

        fields: null,
        removeControl: true,
        inputItemWidget: _InputItem,

        messages: {
            'addLabel': 'Add'
        },

        postMixInProperties: function () {
            try {
                if (!this.fields) {
                    throw "Fields must be defined";
                }

                if (this.name.indexOf('[') == -1) {
                    this.name = this.name+'[]';
                }
                this.inherited(arguments);
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        _addNewChild: function () {
            try {
                var widget = new this.inputItemWidget({fields: this.fields, removeControl: this.removeControl});
                var self = this;
                on(widget, 'remove', function () {
                    try {
                        self.removeChild(this);
                        this.destroyRecursive();
                    } catch (e) {
                        console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                        throw e;
                    }
                });

                this.addChild(widget);

                return widget;
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        _getValueAttr: function () {
            try {
                return array.map(this.getChildren(),
                                 function (child) {
                                     return child.attr('value');
                                 });
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        _setValueAttr: function (values) {
            try {
                var self = this;

                array.forEach(this.getChildren(), function (child){
                    self.removeChild(child);
                    child.destroyRecursive();
                });

                array.forEach(values, function (value){
                    var widget = self._addNewChild();
                    widget.attr('value', value);
                });
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        onAdd: function () {
            try {
                this._addNewChild();
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        }
    });
});
