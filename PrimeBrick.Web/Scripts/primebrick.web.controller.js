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