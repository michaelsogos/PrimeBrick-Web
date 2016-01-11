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