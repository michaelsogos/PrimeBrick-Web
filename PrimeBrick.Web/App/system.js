define([], function () {
    //Initialization


    //Controller
    window.system = {
        routes: [
        {
            path: '#',
            config: {
                namespace: 'app',
                view: 'system'
            },
            before: function () {
                App.View.Load('app-body', this);
            },
        }]
    };
    return window.system;
});