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
    "dojo/_base/array",
    "dojox/gesture/swipe"
], function(declare, lang, on, Evented, Destroyable, dom,
            has, touch, win, domGeom, array, swipe) {
    return declare([ Evented, Destroyable ], {

        nodes: [],
        _nodeArray: [],
        _topNodeName: '',
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

                    if (this._minimumY == 0 || this._minimumY > params.t) {
                        this._minimumY = params.t;
                        this._topNodeName = node.toString();
                    }

                }, this);

                if (has('ios') || has('android')) {
                    this.own(on(win.body(), touch.move, lang.hitch(this, '_handler')));
                    this.own(on(win.body(), touch.press, lang.hitch(this, '_handler')));
                    this.own(on(win.body(), touch.cancel, lang.hitch(this, '_handler')));
                    this.own(on(win.body(), touch.release, lang.hitch(this, '_handler')));
                } else {
                    this.own(on(win.body(), (!has("mozilla") ? "mousewheel" : "DOMMouseScroll"),
                                lang.hitch(this, '_handler')));
                }
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
