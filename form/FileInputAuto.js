define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojox/form/FileInputAuto",
    "dojo/_base/fx",
    "dojo/_base/window",
    "dojo/_base/sniff",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/query",
    "dojo/io/iframe",
    "dojo-common/tooltip/AutohideTooltip"
], 
function(declare, lang, FileInputAuto, fx, win, has, domStyle, 
		 domAttr, query, ioIframe, AutohideTooltip){
    
return declare("common.form.FileInputAuto", FileInputAuto, {

    /**
     *
     */
    failedUploadMessage: 'Could not upload file',

    /**
     *
     */
    successfulUploadMessage: 'File uploaded successfully',

    /**
     * Whether or not input field must be refreshed
     * after successfully save
     */
    resetInputAfterSave: true,
    
    postCreate: function () {
        try {
            this.inherited(arguments);

            if (this.realSize) {
                domAttr.set(this.fileInput, 'size', this.realSize);
            }

            domStyle.set(this.cancelNode, 'display', 'none');
            this.__overlayDefaultStyle = domStyle.get(this.overlay);
        } catch (e) {
            console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
            throw e;
        }
    },
    
    setMessage: function(/*String*/ title){
        if (this.overlay && this.overlay.firstChild) {
            this.overlay.removeChild(this.overlay.firstChild);
        }
        this.overlay.appendChild(document.createTextNode(title));
    },
    
    _sendFile: function(e) {
        if(this._sent || this._sending || !this.fileInput.value){ return; }
        this._sending = true;

        domStyle.set(this.fakeNodeHolder,"display","none");
        domStyle.set(this.overlay,{
            opacity:0,
            display:"block"
        });

        this.setMessage(this.uploadMessage);
        fx.fadeIn({ node: this.overlay, duration:this.duration }).play();
        var _newForm;
        if(has('ie') < 9 || (has('ie') && has('quirks'))){
            // just to reiterate, IE is a steaming pile of code.
            _newForm = document.createElement('<form enctype="multipart/form-data" method="post"');
            _newForm.encoding = "multipart/form-data";
        }else{
            // this is how all other sane browsers do it
            _newForm = document.createElement('form');
            _newForm.setAttribute("enctype","multipart/form-data");
            
            // THIS LITTLE STRING MAKE ME TO COPY FULL METHOD
            _newForm.setAttribute("method","post");
        }
        _newForm.appendChild(this.fileInput);
        win.body().appendChild(_newForm);
    
        ioIframe.send({
            url: this.url,
            form: _newForm,
            handleAs: "json",
            handle: lang.hitch(this,"_handleSend"),
            content: this.onBeforeSend()
        });
    },
    
    _matchValue: function(){
        // Nothing to do because we dont want to show cancel button
    },
    
   reset: function (e) {
        try {
            this.inherited(arguments);
    		if (this.realSize) {
    			domAttr.set(this.fileInput, 'size', this.realSize);
            }
            domStyle.set(this.overlay, this.__overlayDefaultStyle);
        } catch (e) {
            console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
            throw e;
        }
   },

    onComplete: function(data, ioArgs, widgetRef) {
        if ((data.status && data.status == 'failed') ||
            (data.status && data.status == 'success' && this.resetInputAfterSave)) {
            widgetRef.reset();
            
            if (data.message) {
               AutohideTooltip.show(data.message, this.fileInput);
            } else {
                AutohideTooltip.show(data.status == 'failed' && this.failedUploadMessage || this.successfulUploadMessage,
                                     this.fileInput);
            }
        } else if (ioArgs.error) {
            widgetRef.reset();
            AutohideTooltip.show(this.failedUploadMessage, this.fileInput);
        }
        this.inherited(arguments);
    }
});
});
