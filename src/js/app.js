var forEach = require("lodash/foreach");

require("./utils/class-list-shim.js");

window.addEventListener("load", function () {

  activateThumbs();

  function activateThumbs() {
    forEach(document.querySelectorAll("[data-bg]"), function (el) {
      el.setAttribute("style", "background-image:url('" + el.getAttribute("data-bg") + "');");
    });
  }
  forEach(document.querySelectorAll(".btn-more-less"), function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      var thisHiddenBoxes = e.target.parentNode.parentNode.querySelectorAll(".more-less");
      forEach(thisHiddenBoxes, function(box) {
        box.classList.toggle("hide");
      });

    });
  });



});
