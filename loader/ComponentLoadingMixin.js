define(['dojo/_base/declare',
        'dijit/_Widget',
        'dojo/_base/lang',
        'dojo/query',
        'dojo/aspect',
        'dojo/dom-construct',
        'dojo/NodeList-manipulate',
        'dojo/NodeList-traverse'],
    function(declare, _Widget, lang, query, aspect, domConstruct) {

        return declare([ _Widget ], {
            manualLoad: false,

            constructor: function () {
                try {
                    aspect.after(this, 'buildRendering',
                        lang.hitch(this, '_buildRendering'));

                    if (!this.manualLoad) {
                        aspect.after(this, 'startup',
                            lang.hitch(this, '_startup'));
                    }
                } catch (e) {
                    console.error(this.declaredClass, arguments, e);
                    throw e;
                }
            },

            _buildRendering: function () {
                try {
                    this.contentNode = domConstruct.create('div');
                    query(this.domNode).children().wrapAll(this.contentNode);

                    this.loadingNode = domConstruct.create('div',
                                                           {'class': 'loading',
                                                            'innerHTML': ''},
                                                           this.domNode, 'first');

                    query(this.contentNode).style('display', 'none');
                    query(this.loadingNode).style('display', '');
                } catch (e) {
                     console.error(this.declaredClass, arguments, e);
                     throw e;
                }
            },

            _startup: function () {
                try {
                    query(this.contentNode).children().place(this.domNode);
                    this.contentNode && query(this.contentNode).orphan();
                    this.loadingNode && query(this.loadingNode).orphan();
                } catch (e) {
                     console.error(this.declaredClass, arguments, e);
                     throw e;
                }
            }
        });
    });
