var forEach = require("lodash/foreach");
var flatten = require("lodash/flatten");
var Modal = require("./utils/modal.js");
var transEvent = require("./utils/which-transition-event.js");

require("./utils/class-list-shim.js");

window.addEventListener("load", function() {
    var modals = [],
        els = document.querySelectorAll(".thumb");
    var modalCB = function(modals) {
      forEach(document.querySelectorAll('[data-switch-modal]'), function(el) {
        var index = el.getAttribute("data-switch-modal");
        el.addEventListener("click", function() {
          modals[index].open();
          return false;
        });
      });
    }
    forEach(els, function(el, index) {
        var modal_opts = {
            "button": el,
            "template": require("./components/modal.pug"),
            "data": JSON.parse(el.getAttribute("data-info")),
            "cb" : modalCB,
            "siblings" : modals,
            "state":"closed"
        };
        modals[index] = new Modal(modal_opts);
        el.setAttribute("style", "background:url('" + el.getAttribute("data-bg") + "') no-repeat center top; background-size:cover;");
    });


});
