App.Utils = {
    /**
     * @description Check if an object NOT EXIST or IS NULL or IS UNDEFINED
     * @param {Object} object - Anything. object, object property or primitive types (like string, number, etc.)
     * @returns {Boolean} true if it is not an object
     */
    isNullOrUndefined: function (object) {
        return typeof object === 'undefined' || object == null ? true : false;
    },
    /**
     * @description Check if object passed to method is a non-empty string
     * @param {String} string - only literal string should be passed, else the method return false
     * @returns {Boolean} true if it is not a string or it is empty
     */
    isNullOrEmpty: function (string) {
        return typeof string === 'string' && string.length >= 1 ? false : true;
    }
}