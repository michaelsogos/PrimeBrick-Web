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