define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/on",
    "dijit/form/ValidationTextBox",
    "dojo/text!./templates/ValidationTextBox.html"
], function(declare, lang, domAttr, domStyle, on, ValidationTextBox, template){
    return declare("dojo-common.form.ValidationTextBox", ValidationTextBox, {
        
        templateString: template,

        showCounter: true,
        
        postCreate: function () {
            try {
                this.inherited(arguments);
                if (this.showCounter) {
                    this._count();
                } else {
                    domStyle.set(this.counterNode, 'display', 'none');
                }
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
        },

        _setValueAttr: function () {
            try {
                this.inherited(arguments);
                if (this.showCounter) {
                    this._count();
                }
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },
        
        _count: function () {
            try {
                var value = domAttr.get(this.textbox, 'value');
                var exists = parseInt(domAttr.get(this.textbox, 'maxlength'));
                
                domAttr.set(this.counterNode, 'innerHTML', exists - (value.length));
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
        },
        
        _onInput: function () {
            try {
                this.inherited(arguments);
                
                this._updatePlaceHolder();
                this.showCounter && this._count();
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
        },
        
        _updatePlaceHolder: function(){
            if(this._phspan){
                this._phspan.style.display=(this.placeHolder&&!this.textbox.value) ? "" : "none";
            }
        },
        
        reset:function(){
            if (this.showCounter) {
                domAttr.set(this.textbox, 'value', '');
                domAttr.set(this.counterNode, 'innerHTML', domAttr.get(this.textbox, 'maxlength'));
            }
            
            this.inherited(arguments);
        }
    });
});
