define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/Evented",
    "dijit/Destroyable",
    "dojo/dom",
    "dojo/sniff",
    "dojo/touch",
    "dojo/_base/window",
    "dojo/dom-geometry",
    "dojo/_base/array"
], function(declare, lang, on, Evented, Destroyable, dom,
            has, touch, win, domGeom, array) {
    return declare('dojo-common/ScrollSpy', [ Evented, Destroyable ], {

        nodes: [],
        _nodeArray: [],
        _topNodeName: null,
        _minimumY: 0,

        constructor: function (nodes) {
            try {
                this.nodes = nodes;
            } catch (e) {
                 console.error(this.declaredClass, arguments, e);
                 throw e;
            }
        },

        startup: function () {
            try {
                array.forEach(this.nodes, function (node) {
                    var _node = dom.byId(node);
                    if (!_node) {
                        throw "Could not found node from array of nodes";
                    }
                    var params = domGeom.getMarginBox(_node);
                    this._nodeArray.push({'pos': params,
                                          'name': node.toString()});

                    if ((this._minimumY == 0 || this._minimumY > params.t) && !this._topNodeName) {
                        this._minimumY = params.t;
                        this._topNodeName = node.toString();
                    }

                }, this);

                if (has('ios') || has('android')) {
                    this.__handlers = [];
                    var toucher = ['move', 'press', 'cancel', 'release'];

                    for (var i = 0; i < toucher.length; i++) {
                        var handle = on.pausable(win.body(),
                                                 touch[toucher[i]],
                                                 lang.hitch(this, '_handler'));
                        this.own(handle);
                        this.__handlers.push(handle);
                    }

                    // Overcome IOS devices who disable all events while scrolling
                    this._interval = setInterval(lang.hitch(this, '_handler'), 1000);

                } else {
                    var handler = on.pausable(win.body(),
                                              (!has("mozilla") ? "mousewheel" : "DOMMouseScroll"),
                                              lang.hitch(this, '_handler'));
                    this.own(handler);
                    this.__handlers = [handler];
                }

            } catch (e) {
                 console.error(this.declaredClass, arguments, e);
                 throw e;
            }
        },

        pause: function () {
            try {
                (has('ios') || has('android')) &&
                    this._interval &&
                        clearInterval(this._interval);
                array.forEach(this.__handlers, function (handler){handler.pause();});
            } catch (e) {
                 console.error(this.declaredClass, arguments, e);
                 throw e;
            }
        },

        resume: function () {
            try {
                if (has('ios') || has('android')) {
                    this._interval && clearInterval(this._interval);
                    this._interval = setInterval(lang.hitch(this, '_handler'), 1000);
                }

                array.forEach(this.__handlers, function (handler){handler.resume();});
            } catch (e) {
                 console.error(this.declaredClass, arguments, e);
                 throw e;
            }
        },

        _handler: function () {
            try {
                this._changed(domGeom.docScroll().y);
            } catch (e) {
                console.error(this.declaredClass, arguments, e);
                throw e;
            }
        },

        _changed: function (posY) {
            try {
                array.forEach(this._nodeArray, function (elem, up) {
                    try {
                       if (posY >= elem.pos.t && posY <= (elem.pos.t+elem.pos.h)) {
                           if (this._lastFoundNode == elem.name) return;
                           this._lastFoundNode = elem.name;
                           console.log("Show node >> ", elem.name, elem);
                           this.emit('nodeShow', elem.name);
                       } else if (posY <= this._minimumY) {
                           if (this._lastFoundNode == this._topNodeName) return;
                           this._lastFoundNode = this._topNodeName;
                           this.emit('nodeShow', this._topNodeName);
                       }
                    } catch (e) {
                         console.error(this.declaredClass, arguments, e);
                         throw e;
                    }
                }, this);
            } catch (e) {
                 console.error(this.declaredClass, arguments, e);
                 throw e;
            }
        }
    });
});
