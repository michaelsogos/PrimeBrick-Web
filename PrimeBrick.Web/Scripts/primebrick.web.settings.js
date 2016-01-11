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


