define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dijit/form/Button",
    "./_BusyButtonMixin"
], function(declare, lang, domAttr, domClass, Button, _BusyButtonMixin){
    return declare("common.form.BusyButton", [Button, _BusyButtonMixin], {});
});
