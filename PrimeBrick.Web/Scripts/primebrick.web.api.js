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