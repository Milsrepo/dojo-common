define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/dom-style",
    "dojo/on",
    "dijit/Dialog"
], function(declare, lang, win, domStyle, on, Dialog) {
    
    return declare('dialog.DestroyableDialog',
                   [ Dialog ], {
        
        draggable: false,
        onShow: function () {
            try {
                this._backupOverflow = domStyle.get(win.body(), 'overflow');
                domStyle.set(win.body(), 'overflow', 'hidden');
                this.inherited(arguments);
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },
        
        hide: function (){
            domStyle.set(win.body(), 'overflow', this._backupOverflow);
            this._backupOverflow = '';
           this.destroyRecursive();
        }
    });
});