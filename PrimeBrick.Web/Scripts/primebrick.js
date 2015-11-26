"use strict";

var App = function () {
    /// <summary>Determines the area of a circle that has the specified radius parameter.</summary>
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

            //Register controller routes
            $.each(controller.routes, function (index, item) {
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
    Load: function (containerId, route, model, events, callback) {
        /// <summary>Load the specified view</summary>
        /// <param name="containerId">The DOM element id that will contain the view's html</param>
        /// <param name="controller">The controller containing the business logic for the view and model</param>
        /// <param name="route">The route configuration that match current url</param>
        /// <param name="model">The view's model in JSON format</param>
        /// <param name="events">An array of events delegate to attach to the view</param>
        /// <param name="callback">An callback function to call when view is ready</param>

        var viewParameters = App.View.GetViewParameters(route);
        if (!viewParameters || !viewParameters.viewPath) {
            App.Log.Error("Cannot find parameters for the path " + route.url + "!")
        }

        var ractive = null;
        require(["text!" + viewParameters.viewPath], function (html) {
            try {
                if (App.Controller.currentInstance.view) {
                    App.Controller.currentInstance.view.teardown();
                    App.Controller.currentInstance.view = null;
                }

                ractive = new Ractive({
                    el: '#' + containerId,
                    template: html,
                    data: model
                });

                if (events) {
                    ractive.on(events);
                };

                ractive.context = route;
                App.Controller.currentInstance.view = ractive;
                App.Controller.currentInstance.view.name = viewParameters.namespace + "." + viewParameters.viewName;
                App.View.LoadLabels(ractive, function (labels) {
                    //Set defaults
                    window.system.view.set('pageSubTitle', '');
                    window.system.view.set('pageTitle', '???');
                    window.system.view.set('pageIcon', 'glyphicon glyphicon-new-window');
                    window.system.view.set('pageRootTitle', '???');
                    window.system.view.set('pageRootPath', '#/' + viewParameters.namespace.replace('app.', ''));

                    //Get from view dictionary
                    var pageTitle = ractive.get('view.labels.pageTitle');
                    if (pageTitle != null) window.system.view.set('pageTitle', pageTitle);
                    var pageSubTitle = ractive.get('view.labels.pageSubTitle');
                    if (pageSubTitle != null) window.system.view.set('pageSubTitle', pageSubTitle);
                    var pageIcon = ractive.get('view.labels.pageIcon');
                    if (pageIcon != null) window.system.view.set('pageIcon', pageIcon);
                    App.Log.Info("The view [" + viewParameters.viewName + "] in [" + viewParameters.namespace + "] is ready!");

                    if (callback) callback(ractive);
                });
                App.Log.Info("The view [" + viewParameters.viewName + "] in [" + viewParameters.namespace + "] has been loaded!");
            } catch (ex) {
                App.Log.Error('Error: Impossible to load the view. ' + ex.message, true);
            }
        }, function (err) {
            App.Log.Error(err, true);
        });
    },
    GetViewParameters: function (route) {
        var result = { namespace: '', viewName: '', viewPath: '' }
        if (!route.config) {
            App.Log.Error("Cannot find configuration for the path " + route.url + "!");
            return;
        }

        result.namespace = route.config.namespace;

        if (route.config.view) {
            result.viewName = route.config.view;
        } else if (route.params.viewName) {
            result.viewName = route.params.viewName;
        } else {
            App.Log.Error("Cannot find the view name for the path " + route.url + "!");
            return result;
        }

        result.viewPath = result.namespace.replace(/\./g, '/') + '/' + result.viewName + '.html';
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