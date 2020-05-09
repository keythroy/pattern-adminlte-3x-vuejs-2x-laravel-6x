var AdminLTEHelper = {
    "initializeApplication": function () {

        Vue.directive('select', {
        twoWay: true,
        bind: function (el, binding, vnode) {
            $(el).select2().on("select2:select", (e) => {
            // v-model looks for
            //  - an event named "change"
            //  - a value with property path "$event.target.value"
            el.dispatchEvent(new Event('change', { target: e.target }));
            });
        },
        });

    },
    "initializeSideMenu": function () {
        $(".main-sidebar .active").removeClass("active");

        var mainFolder = document.body.getAttribute("data-main-folder");
        var strPageURL = window.Router.currentRoute.path;

        strPageURL = strPageURL.replace(("/" + mainFolder), "");

        if ((strPageURL.length > 0)
                && (strPageURL[0] == '/')) {
            strPageURL = strPageURL.substr(1);
        }

        if ("" == strPageURL) {
            return;
        }

        if (("login" == strPageURL)
                || ("forgotpassword" == strPageURL)
                || "profile" == strPageURL) {
            return;
        }

        var PageURL = document.getElementById("pageurl" + strPageURL);
        if (PageURL == undefined) {
            return;
        }

        if ($(PageURL).hasClass("child_menu")) {
            var strParentPageURL = PageURL.getAttribute("data-parent-url");
            if (null === document.getElementById("parentpageurl" + strParentPageURL)) {
                window.location.href = URLPrefix + "home";
            }

            if ("" != strParentPageURL) {
                $(".parentPageLI").removeClass("menu-open").addClass("menu-close");
                $("#parentpageurl" + strParentPageURL).addClass("active");
                $("#parentpageurl" + strParentPageURL).parent().removeClass("menu-close").addClass("menu-open");
            }
        }	

        $(PageURL).addClass("active");
    },
    "initializeFormElements": function () {
        $("select.select2").select2();
    },
    "getMainFolder": function () {
        if (document.body.getAttribute("data-main-folder")) {
            return document.body.getAttribute("data-main-folder");
        } else {
            return "";
        }
    },
    "getURL": function (url) {
        return ("/" + AdminLTEHelper.getMainFolder() + "/" + url);
    },
    "getAPIURL": function (url) {
        return ("/" + AdminLTEHelper.getMainFolder() + "/api/" + url);
    },
    "doVueApplicationMounted": function () {
        AdminLTEHelper.initializeSideMenu();
        AdminLTEHelper.initializeFormElements();
    },
    "doVueApplicationUpdate": function () {
        AdminLTEHelper.initializeSideMenu();
        AdminLTEHelper.initializeFormElements();
    },
    "doVueMenuApplicationMounted": function () {

    },
    "doVueMenuApplicationUpdate": function () {

    }
}

module.exports = AdminLTEHelper;