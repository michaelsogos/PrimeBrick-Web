"use strict";

App.UI = {
    RenderWrapper: function () {
        var ApplicationMenuHeight = $('#application-menu').height();
        $('body').css('padding-top', ApplicationMenuHeight + 'px');
        var WindowHeight = $(window).height();
        var Wrapper = $('#wrapper');
        Wrapper.height(WindowHeight - ApplicationMenuHeight);
    },
};