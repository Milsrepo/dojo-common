define(["dojo/_base/xhr", "dojo/_base/lang", "dojo/json", "dojo/_base/declare", "dojo/store/JsonRest"],
    function(xhr, lang, JSON, declare, JsonRest){

        /**
         * THIS CLASS REQUIRED ONLY FOR ADDING TRAILING SLASH FOR RESOURCES CALLS
         */

return declare("dojo-common.store.JsonRest", JsonRest, {
	 
  getTarget: function(id, options){
    // summary:
    //    If the target has no trailing '/', then append it.
    // id: Number
    //    The identity of the requested target
    // options: Object
    //    Options to the target URL generation. Supported is 'before'.
    options = options || {};
    var target = this.target;
    if (typeof id != "undefined"){
      if (target.charAt(target.length-1) == '/'){
         target += id;
      }else{
        target += '/' + id;
      }
    }
    return target;
  },
          
  get: function(id, options){
		// summary:
		//		Retrieves an object by its identity. This will trigger a GET request to the server using
		//		the url `this.target + id`.
		// id: Number
		//		The identity to use to lookup the object
		// options: Object?
		//		HTTP headers. For consistency with other methods, if a `headers` key exists on this object, it will be
		//		used to provide HTTP headers instead.
		// returns: Object
		//		The object in the store that matches the given id.
		options = options || {};
		var headers = lang.mixin({ Accept: this.accepts }, this.headers, options.headers || options);
		return xhr("GET", {
			url: this.getTarget(id, options),
			handleAs: "json",
			headers: headers
		});
	},

	put: function(object, options){
		// summary:
		//		Stores an object. This will trigger a PUT request to the server
		//		if the object has an id, otherwise it will trigger a POST request.
		// object: Object
		//		The object to store.
		// options: __PutDirectives?
		//		Additional metadata for storing the data.  Includes an "id"
		//		property if a specific id is to be used.
		// returns: dojo/_base/Deferred
		options = options || {};
		var id = ("id" in options) ? options.id : this.getIdentity(object);
		var hasId = typeof id != "undefined";
		return xhr(hasId && !options.incremental ? "PUT" : "POST", {
				url: this.getTarget(id, options),
				postData: JSON.stringify(object),
				handleAs: "json",
				headers: lang.mixin({
					"Content-Type": "application/json",
					Accept: this.accepts,
					"If-Match": options.overwrite === true ? "*" : null,
					"If-None-Match": options.overwrite === false ? "*" : null
				}, this.headers, options.headers)
			});
	},

	add: function(object, options){
		// summary:
		//		Adds an object. This will trigger a PUT request to the server
		//		if the object has an id, otherwise it will trigger a POST request.
		// object: Object
		//		The object to store.
		// options: __PutDirectives?
		//		Additional metadata for storing the data.  Includes an "id"
		//		property if a specific id is to be used.
		options = options || {};
		options.overwrite = false;
		return this.put(object, options);
	},

	remove: function(id, options){
		// summary:
		//		Deletes an object by its identity. This will trigger a DELETE request to the server.
		// id: Number
		//		The identity to use to delete the object
		// options: __HeaderOptions?
		//		HTTP headers.
		options = options || {};
		return xhr("DELETE", {
			url: this.getTarget(id, options),
			headers: lang.mixin({}, this.headers, options.headers)
		});
	}
});

});
