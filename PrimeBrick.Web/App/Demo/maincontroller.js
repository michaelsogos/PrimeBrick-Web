define([], function () {
    //Controller Initialization

    //Controller Instance
    return {
        routes: [
            {
                path: '#/demo',
                config: {
                    namespace: 'app.demo',
                    view: 'demo'
                },
                before: function () {
                    App.View.Load('app-container', this);
                },
            },
            {
                path: '#/demo/:viewName/:id',
                config: {
                    namespace: 'app.demo'
                },
                before: function () {
                    alert(this.params.viewName);
                    alert(this.params.id);
                }
            }, {
                path: '#/demo/:viewName',
                config: {
                    namespace: 'app.demo',
                },
                before: function () {
                    App.View.Load('app-container', this)
                }
            }
        ]
    };
});