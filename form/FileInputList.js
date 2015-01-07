define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/_base/array",
    "dojo/request",
    "dojo/dom-class",
    "dijit/_Widget",
    "dijit/_Container",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/store/Memory",
    "dojo/store/Observable",
    "dgrid/OnDemandGrid",
    "dgrid/Selection",
    "put-selector/put",
    "dijit/form/_FormValueWidget",
    "dojo/text!./templates/FileInputList.html",
    "dojo-common/form/FileInputAuto"
], 
function(declare, lang, on, array, request, domClass, _Widget, _Container, _TemplatedMixin, _WidgetsInTemplateMixin,
         Memory, Observable, Grid, Selection, put, _FormValueWidget,
         templateList){

    return declare("dojo-common.form.FileInputList", [ _Widget, _Container, _TemplatedMixin,
                                                   _FormValueWidget, _WidgetsInTemplateMixin ], {

        templateString: templateList,
        service: '',
        store: null,
        uploadingUrl: null,
        deleteUrl: null,

        multiple: true, // for Form

        data: [],

        messages: {
            'uploaderLabel': 'Select file ...',
            'uploadingMessage': 'Loading ...',
            'failedUploadingMessage': 'Could not upload file, please try again later.',
            'loadImageHint': 'Choose new file',
            'removeConfirmation': 'File will be removed permanently, are you sure ?',
            'removeLabel': 'Remove'
        },

        postMixInProperties: function () {
            try {
                if (!this.uploadingUrl) {
                    this.uploadingUrl = this.service;
                }
                this.inherited(arguments);
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        _refresh: function () {
            try {
                if (!this.store) {
                    this.store = new Observable(new Memory());
                }

                request.get(this.service, {handleAs: 'json'}).then(
                    lang.hitch(this, function (response){
                        this.store.setData([]);

                        array.forEach(response, function (item){
                            this.store.add(item);
                        }, this);
                    }), function () {
                        console.error("Could not load images from remote service */images");
                    }
                );

                return this.store;
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        postCreate: function () {
            try {

                this.data = [];

                var columns =  [
                    { label: "",
                      field: "path",
                      sortable: false }
                ];


                this.grid = new declare([ Grid, Selection ])({
                    columns: columns,
                    showHeader: false,
                    renderRow: lang.hitch(this, 'listRenderer')
                }, this.gridNode);

                this.grid.set('store', this._refresh());
                this.grid.startup();

                this.addChild(this.grid);
                this._set('value', this.get('value'));
                on(this.fileWidget, 'complete', lang.hitch(this, '_dataUploaded'));
                this.inherited(arguments);
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
        },

        _onChange: function(/*Event*/){
            this.grid.refresh();
            this._handleOnChange(this.get('value'), true);
        },

        // for layout widgets:
        resize: function(/*Object*/ size){
            if(size){
                domGeometry.setMarginBox(this.domNode, size);
            }
        },

        getData: function () {
            try {
                return this.data;
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        _getValueAttr: function () {
            try {
                var value = [];
                for (var i in this.data) {
                    value.push(this.data[i].id);
                }
                return value;
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        _dataUploaded: function (data) {
            try {
                if (!data || !data.resources) {
                    return;
                }

                for (var key in data.resources) {
                    var resource = {'id': key,
                                    'path': data.resources[key],
                                    'temporary': 1};

                    this.data.push(resource);
                    this.store.add(resource);
                }

                this._onChange();
            } catch (e) {
                console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                throw e;
            }
        },

        representationNode: function (obj) {
            try {
                return put("img[src='" + obj.path + "']");
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        removeNode: function (obj) {
            try {
                return put("a[href='#']", this.messages.removeLabel);
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        listRenderer: function (obj, options) {
            try {
                var divNode = put("div.resource");
                if (obj['temporary']) {
                    domClass.add(divNode, 'new');
                }

                var resNode = this.representationNode(obj);
                domClass.add(resNode, 'representation');

                var spanNode = this.removeNode(obj);
                domClass.add(spanNode, 'remove');

                put(divNode, resNode);
                put(divNode, spanNode);

                on(spanNode, 'click', lang.hitch(this, function (){
                    if (confirm(this.messages.removeConfirmation)) {
                        var url = this.deleteUrl && this.deleteUrl + '/'+obj.id || this.service + '/' + obj.id;
                        request.del(url).then(lang.hitch(this, function (){
                            this.store.remove(obj.id);
                            for (var key in this.data) {
                                if (this.data[key].id == obj.id) {
                                    this.data.splice( key, 1 );
                                }
                            }
                            this._onChange();
                        }));
                    }
                }));
                return divNode;
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        }
    });
});
