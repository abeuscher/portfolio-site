var forEach = require("lodash/foreach");
var flatten = require("lodash/flatten");
var Modal = require("./modal/index.js");
var transEvent = require("./utils/which-transition-event.js");

require("./utils/class-list-shim.js");

window.addEventListener("load", function() {
  activateBG("data-bg");
  function activateBG(attrName) {
    forEach(document.querySelectorAll("["+attrName+"]"), function(el) {
      el.setAttribute("style", "background:url('" + el.getAttribute(attrName) + "') no-repeat center top; background-size:cover;");
    });
  }


    var modals = [],
        els = document.querySelectorAll(".thumb");
    var modalCB = function(modals,thisModal) {
      forEach(document.querySelectorAll('[data-switch-modal]'), function(el) {
        var index = el.getAttribute("data-switch-modal");
        el.addEventListener("click", function(e) {
          console.log("pager");
          thisModal.close(e);
          modals[index].open();
          return false;
        });
      });
    }
    forEach(els, function(el, index) {
        var modal_opts = {
          "template":require("./components/modal.pug"),
          "data":JSON.parse(el.getAttribute("data-info")),
          "links" : el
        };
        modals[index] = new Modal(modal_opts);
        modals[index].ee.on("open", function() {
            console.log();
            modalCB(modals,modals[index]);
        });
    });

});
