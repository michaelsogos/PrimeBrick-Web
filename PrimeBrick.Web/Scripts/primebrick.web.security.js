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