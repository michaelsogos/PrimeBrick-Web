"use strict";

App.Log = {
    Info: function (message, show) {
        /// <summary>Write a message with low priority to the browser console</summary>
        /// <param name="message">The message to write</param>
        /// <param name="show">True to show the message to user</param>
        console.info(message);
        if (show === true) alert(message);
    },
    Warning: function (message, show) {
        /// <summary>Write a message with medium priority to the browser console</summary>
        /// <param name="message">The message to write</param>
        /// <param name="show">True to show the message to user</param>
        console.warn(message);
        if (show === true) alert(message);
    },
    Error: function (message, show) {
        /// <summary>Write a message with high priority to the browser console</summary>
        /// <param name="message">The message to write</param>
        /// <param name="show">True to show the message to user</param>
        console.error(message);
        if (show === true) alert(message);
    }
};