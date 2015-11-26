"use strict";

require.config({
    baseUrl: 'scripts',
    paths: {
        app: '../app',
        jquery: 'jquery.min',
        bootstrap: 'bootstrap.min',
        jqueryIdle: 'jquery.idle.min',
        hashRouter: 'hash-router.min',
        store: 'store2.min',
        ractive: 'ractive.min',
        primebrick: (DebugMode ? 'primebrick' : 'primebrick.min')
    },
    shim: {
        'jqueryIdle': {
            deps: ['jquery']
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'primebrick': {
            deps: ['jquery']
        }
    },
    text: {
        env: 'xhr'
    },
    urlArgs: (DebugMode ? "v=" + (new Date()).getTime() : "")
});

require(['ractive', 'jquery', 'jqueryIdle', 'bootstrap', 'hashRouter', 'store', 'text', 'primebrick'], function (Ractive) {
    App.Log.Info("Application Started, all global modules are loaded!");

    window.Ractive = Ractive;
                                                              
    App.Controller.Load('system', function () {
        Router.init(
             function (route) {
                 return; //TO DEL


                 if (erp.view) {
                     var currentPath = route.url.replace(/\/*#\//g, '').toLowerCase();
                     erp.view.set('rootPath', '#/' + currentPath.split('/')[0]);
                     erp.view.set('runningPath', '#/' + currentPath);
                     $('#left-sidebar').addClass('hidden-xs');
                 }
             },
             function (tokens) {
                 var controllerHash = '#/';
                 if (tokens.length >= 1) controllerHash += tokens[0];
                 if (controllerHash != '#/') {
                     if (window.system.view == null) {
                         var route = Router.matchRoute('#');
                         if (route) Router.run(route);
                     }
                     var controllerRoute = Router.matchRoute(controllerHash);
                     if (!controllerRoute) {
                         var ControllerNamespace = tokens[0] + "/maincontroller";
                         App.Controller.Load(ControllerNamespace);
                         //App.Log.Error("Cannot find a controller route for hash " + controllerHash + "!", true);
                         return;
                     }
                     if (!App.Controllers.FindInstance(controllerRoute.config.namespace + "." + controllerRoute.config.controller)) Router.run(controllerRoute);
                 }
             });
        App.Log.Info("Router module has been initialized!");
    });

    $(document).idle({
        onIdle: function () {
            $('.lock-screen').show();
        },
        idle: 600000 //60s * 10min * 1000ms
    });
}, function (err) {
    App.Log.Error(err);
});