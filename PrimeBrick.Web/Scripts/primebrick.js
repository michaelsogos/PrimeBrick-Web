"use strict";

var App = function () {
    /// <summary>Determines the area of a circle that has the specified radius parameter.</summary>
};
App.Utils = {
    /**
     * @description Check if an object NOT EXIST or IS NULL or IS UNDEFINED
     * @param {Object} object - Anything. object, object property or primitive types (like string, number, etc.)
     * @returns {Boolean} true if it is not an object
     */
    isNullOrUndefined: function (object) {
        return typeof object === 'undefined' || object == null ? true : false;
    },
    /**
     * @description Check if object passed to method is a non-empty string
     * @param {String} string - only literal string should be passed, else the method return false
     * @returns {Boolean} true if it is not a string or it is empty
     */
    isNullOrEmpty: function (string) {
        return typeof string === 'string' && string.length >= 1 ? false : true;
    }
}
"use strict";

App.Enumerators = {
    AuthenticationTypes: {
        Token: 0,
        Windows: 1,
    }
}

App.Settings = {
    View: {
        AutoLoadLabels: true,
    },
    API: {
        AuthenticationType: App.Enumerators.AuthenticationTypes.Token
    }
};



"use strict";

App.Security = {
    GetAuthenticationToken: function () {
        var userAuthToken = App.Session.Load('userAuthToken');
        if (!userAuthToken || !userAuthToken.access_token || !userAuthToken.token_type) {
            console.error("Cannot call secure api without authorization token. Please, login before do anything!");
        };
        return userAuthToken;
    }
}
"use strict";

App.API = {
    /**
     * @description Call Web Api behind authentication\authorization mechanism
     * @param {String} path - The API path
     * @param {Function} callback - Because by default this method is async, is possible to specify a function to execute when response has been sent from server.The callback function is supposed accepting three parameters: API Response, A bool value indicating if server caught an error (True= Have error), callbackContext.
     * @param {Object} callbackContext - Custom object passed to callback. 
     * @param {Object} data - Anything from string to Json object sent to server as API parameters.
     * @param {Object.<method: String, async: Boolean>} options - method: http verb [default=GET], async: false to stop code execution until server send response [default=true]
     * @returns {Object} Only usable if the options.async = false, this method will return the server response.
     */
    CallSecureApi: function (path, callback, callbackContext, data, options) {
        //Validation
        if (App.Utils.isNullOrEmpty(path)) {
            App.Log.Error("Cannot call API because the parameter [path] is not valued. It is mandatory!", true);
            return false;
        }
        if (typeof callback !== 'function') {
            App.Log.Warning('No callback function has been specified for API at path [' + path + '].');
        }

        var result = null;
        if (App.Utils.isNullOrUndefined(options)) options = {};
        $.ajax({
            url: path,
            type: App.Utils.isNullOrUndefined(options.method) ? 'GET' : options.method.toUpperCase(),
            dataType: 'json',
            async: App.Utils.isNullOrUndefined(options.async) ? true : options.async,
            data: data,
            headers: App.Settings.API.AuthenticationType == App.Enumerators.AuthenticationTypes.Token ? { 'Authorization': userAuthToken.token_type + ' ' + userAuthToken.access_token } : '',
            success: function (response) {
                if (typeof callback === 'function') {
                    callback(response, false, callbackContext);
                }
                result = response;
            },
            error: function (request, status, error) {
                App.Log.Error('Error: While calling API; ' + request.responseText);
                if (typeof callback === 'function') {
                    callback(request.responseJSON ? request.responseJSON : request.responseText, true, callbackContext);
                }
                result = null;
            }
        });

        return result;
    },
    //#region "Not refactored code"

    //GetSecureBinaryData: function (path, data, method, async, callback, callbackContext) {
    //    var userAuthToken = App.Session.Load('userAuthToken');
    //    if (!userAuthToken || !userAuthToken.access_token || !userAuthToken.token_type) {
    //        console.error("Cannot call secure api without authorization token. Please, login before do anything!");
    //    };

    //    var result = null;
    //    $.ajax({
    //        url: path,
    //        type: method ? method.toUpperCase() : 'GET',
    //        async: async === true ? true : false,
    //        data: data,
    //        headers: { 'Authorization': userAuthToken.token_type + ' ' + userAuthToken.access_token },
    //        success: function (data) {
    //            if (callback) {
    //                callback(data, false, callbackContext);
    //            }
    //            result = data;
    //        },
    //        error: function (request, status, error) {
    //            console.error('Error: While getting secure binary data; ' + request.responseText);
    //            if (callback) {
    //                callback(request.responseJSON ? request.responseJSON : request.responseText, true, callbackContext);
    //            }
    //            result = null;
    //        }
    //    });
    //    return result;
    //},
    //DownloadSecureFile: function (path, data) {
    //    var userAuthToken = App.Session.Load('userAuthToken');
    //    if (!userAuthToken || !userAuthToken.access_token || !userAuthToken.token_type) {
    //        console.error("Cannot download secure file without authorization token. Please, login before do anything!");
    //    };

    //    var url = path + '?authtoken=' + userAuthToken.access_token;

    //    for (var key in data) {
    //        if (data.hasOwnProperty(key)) {
    //            url = url + '&' + key + '=' + data[key];
    //        }
    //    }

    //    var iframe = $("<iframe/>").attr({
    //        src: url,
    //        style: "visibility:hidden;display:none"
    //    }).appendTo('body').remove();
    //},
    //CallODataService: function (entitySet, queryOptions, async, callback) {
    //    var userAuthToken = App.Session.Load('userAuthToken');
    //    if (!userAuthToken || !userAuthToken.access_token || !userAuthToken.token_type) {
    //        console.error("Cannot call secure api without authorization token. Please, login before do anything!");
    //    };

    //    var oDataResult = null;
    //    $.ajax({
    //        url: "/odata/" + entitySet,
    //        type: 'GET',
    //        dataType: 'json',
    //        data: queryOptions,
    //        async: async ? async : false,
    //        headers: { 'Authorization': userAuthToken.token_type + ' ' + userAuthToken.access_token },
    //        success: function (data) {
    //            oDataResult = data;
    //            if (callback) callback(data);
    //        },
    //        error: function (request, status, error) {
    //            console.error('Error: Impossible to call OData service. ' + request.responseText + '!');
    //            oDataResult = null;
    //            if (callback) callback(null);
    //        }
    //    });
    //    return oDataResult;
    //},

    //#endregion
};
"use strict";

App.Controller = {
    currentInstance: null,
    Load: function (controllerPath, callback) {
        /// <summary>Load controller by path</summary>
        /// <param name="controllerPath">The path of controller class</param>

        require(['app/' + controllerPath], function (controller) {
            App.Log.Info("The controller ['app/" + controllerPath + "'] has been loaded!");

            //Controller validation
            if (controller.routes == null || controller.routes.length <= 0) {
                App.Log.Error("The controller doesn't have a routes array defined!", true);
                return;
            }

            $.each(controller.routes, function (index, item) {
                //Route validation
                if (App.Utils.isNullOrUndefined(item.path)) {
                    App.Log.Error("The controller route at index [" + index + "] doesn't have the property [path] valued. It is mandatory!");
                    return false;
                }
                //Register route  
                if (typeof item.on !== 'function') {
                    //The system assume that the [on] function should be automatically load a view
                    if (App.Utils.isNullOrUndefined(item.config)) {
                        App.Log.Error("The controller route at index [" + index + "] doesn't have the property [config] valued. It is mandatory!", true);
                        return false;
                    }
                    if (App.Utils.isNullOrUndefined(item.config.namespace)) {
                        App.Log.Error("The controller route at index [" + index + "] doesn't have the property [config.namespace] valued. It is mandatory to load a view!", true);
                        return false;
                    }
                    if (App.Utils.isNullOrUndefined(item.config.view)) {
                        App.Log.Error("The controller route at index [" + index + "] doesn't have the property [config.view] valued. It is mandatory to load a view!", true);
                        return false;
                    }
                    if (App.Utils.isNullOrUndefined(item.config.viewContainer)) {
                        App.Log.Error("The controller route at index [" + index + "] doesn't have the property [config.viewContainer] valued. It is mandatory to load a view!", true);
                        return false;
                    }

                    item.on = function () {
                        var viewCallback = typeof item['onLoad' + item.config.view] === 'function' ? item['onLoad' + item.config.view] : null;
                        if (!viewCallback) App.Log.Warning('No loading function [onLoad' + item.config.view + '] has been specified for controller route at index [' + index + '].');
                        App.View.Load(item, viewCallback);
                    };
                }
                          
                Router.add(item);
            });

            var route = Router.matchRoute(window.location.hash);
            if (route) Router.run(route);

            App.Controller.currentInstance = controller;

            if (callback) callback();
        }, function (err) {
            App.Log.Error(err);
        });
    }
};
"use strict";

App.View = {
    /** @description Load a view.
     * @param {Object} routeConfig - A configuration about view.
     * @param {Function} callback - Because this method is async, is possible to specify a function to execute just after the view has been rendered. It is supposed that its [this] is the routeConfig and as first parameter the Ractive object will passed.
     */
    Load: function (routeConfig, callback) {
        //Config validation
        if (App.Utils.isNullOrUndefined(routeConfig.config)) {
            App.Log.Error("Cannot load a view because the parameter [config] is not valued. It is mandatory!", true);
            return false;
        }
        if (App.Utils.isNullOrUndefined(routeConfig.config.namespace)) {
            App.Log.Error("The view configuration doesn't have the property [config.namespace] valued. It is mandatory to load a view!", true);
            return false;
        }
        if (App.Utils.isNullOrUndefined(routeConfig.config.view)) {
            App.Log.Error("The view configuration doesn't have the property [config.view] valued. It is mandatory to load a view!", true);
            return false;
        }
        if (App.Utils.isNullOrUndefined(routeConfig.config.viewContainer)) {
            App.Log.Error("The view configuration doesn't have the property [config.viewContainer] valued. It is mandatory to load a view!", true);
            return false;
        }

        var viewDynamicPath = App.View.__GetViewPath(routeConfig);
        if (!viewDynamicPath.viewPath) {
            App.Log.Error("Cannot recreate the view path from configuration or url parameters!")
        }

        var ractive = null;
        require(["text!" + viewDynamicPath.viewPath], function (html) {
            try {
                if (App.Controller.currentInstance.view) {
                    App.Controller.currentInstance.view.teardown();
                    App.Controller.currentInstance.view = null;
                }

                ractive = new Ractive({
                    el: '#' + routeConfig.config.viewContainer,
                    template: html
                });

                if (!App.Utils.isNullOrUndefined(routeConfig.config.viewEvents)) ractive.on(routeConfig.config.viewEvents);
                if (!App.Utils.isNullOrUndefined(routeConfig.config.viewPartials)) {
                    $.each(routeConfig.config.viewPartials, function (index, item) {
                        ractive.partials[item] = '';
                        require(["text!" + routeConfig.config.namespace.replace(/\./g, '/') + "/" + item + ".html"], function (html) {
                            ractive.resetPartial(item, html);
                            var partialOnLoad = typeof routeConfig['onLoad' + item] === 'function' ? 'onLoad' + item : null;
                            if (!partialOnLoad) App.Log.Warning('No loading function [onLoad' + item + '] has been specified for partial [' + item + '].');
                            routeConfig[partialOnLoad]();
                        });
                    });
                }
                if (!App.Utils.isNullOrUndefined(routeConfig.config.modelObservers)) {
                    for (var prop in routeConfig.config.modelObservers) {
                        if (routeConfig.config.modelObservers.hasOwnProperty(prop)) ractive.observe(prop, routeConfig.config.modelObservers[prop], { init: false });
                    };
                }

                //ractive.context = config;
                App.Controller.currentInstance.view = ractive;
                App.Controller.currentInstance.view.path = viewDynamicPath.viewPath;

                //Set defaults
                //TODO Reset these variables only if the app-container will be changed, because is possible to load a small view (sidebar?) without impact on entire system variables
                window.system.view.set('pageSubTitle', '');
                window.system.view.set('pageTitle', '???');
                window.system.view.set('pageIcon', 'glyphicon glyphicon-new-window');
                window.system.view.set('pageRootTitle', '???');
                window.system.view.set('pageRootPath', '#/' + routeConfig.config.namespace.replace('app.', ''));

                //TODO Give possibility to specify labels strategy, from API or from static JS (i18n?)
                if (App.Settings.View.AutoLoadLabels) {
                    App.View.LoadLabels(ractive, function (labels) {
                        //Get from view dictionary
                        var pageTitle = ractive.get('view.labels.pageTitle');
                        if (pageTitle != null) window.system.view.set('pageTitle', pageTitle);
                        var pageSubTitle = ractive.get('view.labels.pageSubTitle');
                        if (pageSubTitle != null) window.system.view.set('pageSubTitle', pageSubTitle);
                        var pageIcon = ractive.get('view.labels.pageIcon');
                        if (pageIcon != null) window.system.view.set('pageIcon', pageIcon);
                        App.Log.Info("The view [" + viewDynamicPath.viewName + "] in [" + routeConfig.config.namespace + "] is ready!");

                        if (callback) callback.bind(routeConfig, ractive)();
                    });
                } else {
                    if (callback) callback.bind(routeConfig, ractive)();
                };

                App.Log.Info("The view [" + viewDynamicPath.viewName + "] in [" + routeConfig.config.namespace + "] has been loaded!");
            } catch (ex) {
                App.Log.Error('Error: Impossible to load the view. ' + ex.message, true);
            }
        }, function (err) {
            App.Log.Error(err, true);
        });
    },
    __GetViewPath: function (routeConfig) {
        if (App.Utils.isNullOrUndefined(routeConfig)) {
            App.Log.Error("The route configuration is not an object!");
            return null;
        }
        if (App.Utils.isNullOrUndefined(routeConfig.config)) {
            App.Log.Error("The route configuration do not contain a valid [config] property!");
            return null;
        }
        if (App.Utils.isNullOrUndefined(routeConfig.config.namespace)) {
            App.Log.Error("The route configuration do not contain a valid [config.namespace] property!");
            return null;
        }
        if (App.Utils.isNullOrUndefined(routeConfig.config.view) && App.Utils.isNullOrUndefined(routeConfig.params) && App.Utils.isNullOrUndefined(routeConfig.params.viewName)) {
            App.Log.Error("The route configuration do not contain a valid [config.view] or [params.viewName] property!");
            return null;
        }
        //TODO Per ora sia il controller.load() che view.load() hanno regole di validazione che obbligano l'uso della proprietà config.view, invece deve essere mutualmente obbligatorio con il parametro :viewName

        var result = { viewName: null, viewPath: null };
        if (routeConfig.config.view) {
            result.viewName = routeConfig.config.view;
        } else if (routeConfig.params.viewName) {
            result.viewName = routeConfig.params.viewName;
        } else {
            console.error("Cannot find the view name for the path " + routeConfig.url + "!");
            return result;
        }

        result.viewPath = routeConfig.config.namespace.replace(/\./g, '/') + '/' + result.viewName + '.html';
        return result;
    },
    LoadLabels: function (view, callback) {
        if (!view.name) {
            App.Log.Error("Cannot find view name!", true);
            return;
        }
        $.ajax({
            url: '/api/dictionary/viewlabels/' + encodeURI(view.name) + '/',
            type: 'GET',
            async: true,
            dataType: 'json',
            success: function (response) {
                view.set('view.labels', response);
                if (callback) callback(response);
            },
            error: function (request, status, error) {
                if (request.responseText != null && request.responseText.length <= 100) {
                    App.Log.Error('Impossible to get the view labels.\r\nError: ' + request.responseText, true);
                } else {
                    App.Log.Error('Impossible to get the view labels.\r\nError: ' + request.responseText, false);
                    App.Log.Error('Impossible to get the view labels.\r\nError: ' + error, true);
                }
            }
        });
    },
}
"use strict";

App.Log = {
    Info: function (message, show) {
        /// <summary>Write a message with low priority to the browser console</summary>
        /// <param name="message">The message to write</param>
        /// <param name="show">True to show the message to user</param>
        console.info(message);
        if (show === true) alert(message);
    },
    Warning: function (message, show) {
        /// <summary>Write a message with medium priority to the browser console</summary>
        /// <param name="message">The message to write</param>
        /// <param name="show">True to show the message to user</param>
        console.warn(message);
        if (show === true) alert(message);
    },
    Error: function (message, show) {
        /// <summary>Write a message with high priority to the browser console</summary>
        /// <param name="message">The message to write</param>
        /// <param name="show">True to show the message to user</param>
        console.error(message);
        if (show === true) alert(message);
    }
};
"use strict";

App.UI = {
    RenderWrapper: function () {
        var ApplicationMenuHeight = $('#application-menu').height();
        $('body').css('padding-top', ApplicationMenuHeight + 'px');
        var WindowHeight = $(window).height();
        var Wrapper = $('#wrapper');
        Wrapper.height(WindowHeight - ApplicationMenuHeight);
    },
};