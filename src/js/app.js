var forEach = require("lodash/foreach");
var Flickity = require("flickity");
var parseHTML = require("./utils/parse-html");

require("flickity-as-nav-for");
require("./utils/class-list-shim.js");

var templates = {
  "modalCarousel": require("./components/site-modal.pug")
};

window.addEventListener("load", function () {

  activateThumbs();
  activaterMoreLess();
  activateSiteBlocks();


});

function activateThumbs() {
  forEach(document.querySelectorAll("[data-bg]"), function (el) {
    el.setAttribute("style", "background-image:url('" + el.getAttribute("data-bg") + "');");
  });
}
function activaterMoreLess() {
  forEach(document.querySelectorAll(".btn-more-less"), function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      var thisHiddenBoxes = e.target.parentNode.parentNode.querySelectorAll(".more-less");
      forEach(thisHiddenBoxes, function (box) {
        box.classList.toggle("show");
      });
      this.innerHTML = this.innerHTML == "more" ? "less" : "more";
    });
  });
}
function activateSiteBlocks() {
  var siteBlocks = document.querySelectorAll("[data-info]");
  var carouselData = [];
  forEach(siteBlocks, function (block) {
    carouselData.push(JSON.parse(block.getAttribute("data-info")));
    block.addEventListener("click", launchModal);
  });

  document.body.appendChild(parseHTML(templates.modalCarousel(carouselData)));

  var sc = new Flickity(document.getElementById("site-carousel"), {
    "wrapAround": true,
    "pageDots": false,
    "lazyLoad": 2,
    "autoPlay": 8000,
    "adaptiveHeight": false
  });

  document.getElementById("modal-wrapper").addEventListener("click", closeModal);
  document.getElementsByClassName("btn-close")[0].addEventListener("click", closeModal);

  function closeModal(e) {
    if (e.target.classList.contains("modal-bg") || e.target.classList.contains("btn-close")) {
      e.preventDefault();
      document.body.classList.remove("modal-open");
    }
  }

  function launchModal(e) {
    e.preventDefault();
    if (document.body.classList.contains("modal-open")) {
      document.body.classList.remove("modal-open");
    }
    else {
      document.body.classList.add("modal-open");
      sc.resize();
    }
    sc.select(getIndex(e.target));
    function getIndex(el) {
      while (el && !el.hasAttribute("data-index")) {
        el = el.parentNode;
      }
      return el.hasAttribute("data-index") ? el.getAttribute("data-index") : 0;
    }
  }
  
}