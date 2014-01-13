define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "../string",
    "dojo/router/RouterBase"
], function(declare, lang, array, string, RouterBase){

    // Firing of routes on the route object is always the same,
    // no clean way to expose this on the prototype since it's for the
    // internal router objects.
    function fireRoute(params, currentPath, newPath){
        var queue, isStopped, isPrevented, eventObj, i, l;

        queue = this.callbackQueue;
        isStopped = false;
        isPrevented = false;
        eventObj = {
            stopImmediatePropagation: function(){ isStopped = true; },
            preventDefault: function(){ isPrevented = true; },
            oldPath: currentPath,
            newPath: newPath,
            params: params
        };

        console.debug("Route Fired >> ", newPath,
                      "queue.length >>", queue.length,
                      "queue >>", queue);

        for(i=0, l=queue.length; i<l; ++i){
            if(!isStopped){
                queue[i](eventObj);
            }
        }

        return !isPrevented;
    }

    // Our actual class-like object
    var RouterPartial = declare([RouterBase], {

        _targets: {},

        constructor: function(){
            this._targets = {};
        },

        registerPartial: function(/*String|RegExp*/ target, /*String|RegExp*/ route, /*Function*/ callback, /*Boolean?*/ isBefore){
            // see: BaseRouter::register
            //
            // description:
            //		It is has the same behavior as BaseRouter::register
            //      except one extra parameter target. Parameter target
            //      it is kind of namespace where your route will be
            //      executed. On example you have two nested TabContainers.
            //      First TabContainer"Users" with three tabs "Admins, Moderators, Regular".
            //      Second (Nested inside tab Users->Regular) TabContainer has another two tabs
            //      "Accepted, Pending". You need to provide ability to bring Users->Regular->Pending
            //      tab to user by url /users/regular/pending.

            //      If we will use plain BaseRouter: you will need to register a route
            //      with callback and inside callback define something like
            //      (UsersTabContainer-->SelectChild(Regular)-->SelectChild(Pending))
            //
            //      If we will use PartialRouter: you will need to register three routes
            //      register('/', '/users', OpenTabContainer(User));
            //      register('/users', '/regular', SelectChild(Regular));
            //      register('/users/regular', '/pending', SelectChild(Pending));
            //      And when user will put in address /users/regular/pending, router
            //      will execute callback for every peace of the user URI
            //          - one for /users,
            //          - one for /regular inside the /users,
            //          - one for /pending inside the /regular who inside the /users
            //      So in result will be 3 callbacks executed one for every peace of route.
            // example:
            //  |   router.register("/","/users", function (){
            //  |        // if the hash was /users
            //  |   }).register("/regular", function (){
            //  |       // if the hash was /users/regular
            //  |   })
            // returns: Object
            //		A plain JavaScript object to be used as a handle for
            //		either removing this specific callback's registration, as
            //		well as to add new callbacks with the same target initially
            //		used.
            // target: String
            //      Namespace where route will have effect
            // -----
            // all other parameters the same with BaseRouter

            if (arguments.length == 2) {
                callback = route;
                route = target;
                target = '/';
            }

            return this._registerPartialRoute(target, route, callback, isBefore);
        },

        _prepareTargets: function (/*String|Array|RegExp*/ targets) {
            // summary:
            //      Method transform targets to suitable array
            //      format.
            // returns:
            //      Array
            try {
                var _splitTarget = [];

                if (targets instanceof Array) {
                    _splitTarget = targets;
                } else if (typeof targets == 'object') {
                    _splitTarget = [targets];
                } else if (typeof targets == 'string') {
                    _splitTarget = targets.split('/');
                    // Avoiding situation when split "/"
                    // and return ["", ""] now it is
                    // will be [""], avoid as well
                    // situation if targets equal empty "".
                    if (_splitTarget && _splitTarget.length > 1 && _splitTarget[0] == '') {
                        _splitTarget.splice(0,1)
                    }
                } else {
                    throw "Targets must be array or string types";
                }

                if (_splitTarget[0] && _splitTarget[0] != '/') {
                    _splitTarget.unshift('/');
                }
                return _splitTarget;
            } catch (e) {
                 console.error(this.declaredClass+" "+arguments.callee.nom, arguments, e);
                 throw e;
            }
        },

        registerBefore: function(/*String|RegExp*/ route, /*Function*/ callback){
            // summary:
            //		This method is unsupported

            // FIXME:
            //      It is not correct to close one of methods
            //      in public interface of parent.
            //      Parent must be reorganized.
            throw TypeError("Method unsupported");
        },

        _stripExclusiveRegExp: function (/*String*/ str) {
            // summary:
            //      Will transform regexps like
            //      /^...$/ -> .* and /.../ to ...
            return str.replace(new RegExp(/^(\/\^|\/)/), '').
                        replace(new RegExp(/(\$\/|\/)$/), '');
        },

        _registerPartialRoute: function(/*String|Array*/targets, /*String|RegExp*/route, /*Function*/callback,
                                 /*Boolean?*/ isBefore){
            var index, exists, routeObj, callbackQueue = [], removed, self = this,
                routes = this._routes, routeIndex = this._routeIndex,
                parentTarget, foundTarget = null;

            if (typeof targets == 'undefined') {
                throw "Targets must be defined";
            }

            if (typeof route == 'undefined') {
                throw "Route must be defined";
            } else if (typeof(route) == 'string' || typeof(route) == 'array') {
                var prouteParts;
                if (typeof(route) == 'string') {
                    prouteParts = route.split('/');
                } else {
                    prouteParts = route;
                }

                prouteParts = array.filter(prouteParts, function(part){return string.trim(part).length});

                if (prouteParts.length > 1) {
                    lastRoute = prouteParts.pop();
                    var _router = null;

                    for (var i = 0; i < prouteParts.length; i++) {
                        if (!_router) {
                            _router = this._registerPartialRoute(targets,
                                                                 "/"+prouteParts[i],
                                                                 function (){}, isBefore);
                        } else {
                            _router = _router.register("/"+prouteParts[i],
                                                       function (){});
                        }
                    }
                    return _router.register("/"+lastRoute, callback);
                }
            }

            if (!lang.isFunction(callback)) {
                throw "Callback must be defined";
            }

            _splitTarget = this._prepareTargets(targets);

            var matchedRoute = '';
            for (var i = 0;i < _splitTarget.length; i++) {
                var _t = '';
                if (typeof _splitTarget[i] == 'object') {
                   _t = this._stripExclusiveRegExp(_splitTarget[i].toString());
                } else {
                   _t = _splitTarget[i].substr(0, 1) != '/' && '/'+_splitTarget[i] || _splitTarget[i];
                }
                if (_t != '/') {
                    matchedRoute+=_t;
                }
                _splitTarget[i] = _t;
            }

            if (typeof route == 'object') {
                matchedRoute+=this._stripExclusiveRegExp(route.toString());
            } else {
                matchedRoute+=route;
            }

            (function _findRoute(splitTarget, targetsPointer) {
                var node = splitTarget.shift();
                foundTarget = targetsPointer[node];

                if (!foundTarget) {
                    foundTarget = targetsPointer[node] = {"fire": [], "sr": {}};
                }

                if (lang.isArray(foundTarget['fire'])) {
                    callbackQueue = callbackQueue.concat(foundTarget['fire']);
                }

                if (!splitTarget.length) {
                    if (targetsPointer[node]['sr'][route]) {
                        targetsPointer[node]['sr'][route]
                                    .fire[isBefore && 'unshift' || 'push'](callback);
                    } else {
                        targetsPointer[node]['sr'][route] = {"fire": [callback],
                                                             "sr": {}};
                    }

                    parentTarget = targetsPointer[node].sr;
                    foundTarget = targetsPointer[node]['sr'][route];
                    callbackQueue = callbackQueue.concat(foundTarget.fire);
                } else {
                    parentTarget = foundTarget.sr;
                    _findRoute(splitTarget, foundTarget.sr);
                }
            })(_splitTarget, this._targets);

            index = this._routeIndex[matchedRoute];
            exists = typeof index !== "undefined";

            routeObj = exists && routes[index] || {};
            routeObj['route'] =  matchedRoute;
            routeObj['callbackQueue'] = callbackQueue;
            routeObj['fire'] =  fireRoute;


            routeObj.parameterNames = this._getParameterNames(matchedRoute);
            routeObj.route = this._convertRouteToRegExp(matchedRoute);

            if(!exists){
                index = routes.length;
                routeIndex[matchedRoute] = index;
                routes.push(routeObj);
            }

            // Useful in a moment to keep from re-removing routes
            removed = false;

            return { // Object
                remove: function(){
                    // summary:
                    //      Method will remove currently
                    //      registered route from the tree
                    //      of routes.
                    if(removed){ return; }
                    delete(parentTarget[route]);
                    routes.splice(index, 1);
                    self._indexRoutes();
                    removed = true;
                },

                getFullRoute: function (/*String*/route) {
                    // summary:
                    //      Method will return full route
                    //      with given route concatenated
                    //      at the end.
                    return matchedRoute + (route || '');
                },

                register: function(/*String*/ route,/*Function*/ callback){
                    // summary:
                    //      Register route in the context/target of
                    //      the previous route was registered.
                    return self.registerPartial(matchedRoute, route, callback);
                },

                addCallback: function (/*Function*/ callback,/*Boolean*/ isBefore) {
                    // summary:
                    //      Add callback function to the stack of callback functions
                    //      registered for the currently registered route.
                    return self.registerPartial(targets, route, callback, isBefore);
                }
            };
        }
    });

    return RouterPartial;
});
