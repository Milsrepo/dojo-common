define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dijit/Tooltip"
], function(declare, lang, Tooltip) {

    var AutoHideTooltip = declare("dojo-common.tooltip.AutohideTooltip", [ Tooltip._MasterTooltip ], {
        /* How long tooltip will be displayed
         * 
         * @param {Integer} timeout
         * */
        timeout: 2000,
        
        _onShow: function() {
            var timeout = setTimeout(dojo.hitch(this, function () {
                console.group(this.declaredClass+" _onShow.timeout",arguments);
                try {
                    this.hide(this.aroundNode);
                } catch (e) {
                    console.error(e);
                    console.groupEnd();
                    throw e;
                }
                console.groupEnd();
            }), this.attr('timeout'));
            
            var conn = dojo.connect(dojo.body(),'onclick',dojo.hitch(this, function (){
                try {
                    dojo.disconnect(conn);
                    this.hide(this.aroundNode);
                } catch (e) {
                    console.error(this.declaredClass + " " + arguments.callee.nom, arguments, e);
                    throw e;
                }
            }));
            
            var wheelConn = dojo.connect(dojo.body(), (!dojo.isMozilla ? "onmousewheel" : "DOMMouseScroll"), 
                                     dojo.hitch(this, function(e){
                try {
                    dojo.disconnect(wheelConn);
                    this.hide(this.aroundNode);
                } catch (e) {
                    console.error(this.declaredClass + " " + arguments.callee.nom, arguments, e);
                    throw e;
                }
             }));
            
            var subs = dojo.subscribe('AutoHideTooltip-hide', function (){
                try {
                    dojo.disconnect(conn);
                    clearTimeout(timeout);
                    dojo.unsubscribe(subs);
                } catch (e) {
                    console.error(this.declaredClass + " " + arguments.callee.nom, arguments, e);
                    throw e;
                }
            });
            
            this.inherited(arguments);
        },
        
        _onHide: function () {
            console.group(this.declaredClass+" "+arguments.callee.nom,arguments);
            try {
                dojo.publish('AutoHideTooltip-hide');
                this.inherited(arguments);
            } catch (e) {
                console.error(e);
                console.groupEnd();
                throw e;
            }
            console.groupEnd();
        }
    });

    return {
        show: function(/*String*/ innerHTML, /*DomNode*/ aroundNode, /*String[]?*/ position){
            if(!AutoHideTooltip.prototype._masterTT){ AutoHideTooltip.prototype._masterTT = new AutoHideTooltip(); }
            return AutoHideTooltip.prototype._masterTT.show(innerHTML, aroundNode, position);
        },

        hide: function(/*DomNode*/ aroundNode){
            if(!AutoHideTooltip.prototype._masterTT) return;
            return AutoHideTooltip.prototype._masterTT.hide(aroundNode);
        }
    };
});