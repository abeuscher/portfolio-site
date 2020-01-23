var forEach = require("lodash/foreach");

require("./utils/class-list-shim.js");

window.addEventListener("load", function() {
  
  activateThumbs();

  function activateThumbs() {
    forEach(document.querySelectorAll("[data-bg]"), function(el) {
      el.setAttribute("style", "background:url('" + el.getAttribute("data-bg") + "') no-repeat center top; background-size:cover;");
    });
  }



});
