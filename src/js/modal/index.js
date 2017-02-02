var ee = require("event-emitter");
var getDefaults = require("lodash/defaults");
var forEach = require("lodash/forEach");



var default_opts = {
  "container" : document.body,
  "classes" : {
    "container" : "modal-open",
    "modal" : "modal",
    "modalWrapper" : "modal-overlay",
    "closeButton" : "btn-close"
  },
  "containerClass" : "modal-open",
  "modalWrapperClass" : "modal-overlay",
  "modalClass" : "modal",
  "template" : require("./inc/sample-modal.pug"),
  "data" : require("./sample-data.json")
}


var Modal = function(opts) {
    this.opts = getDefaults(opts,default_opts);
    this.opts.id = require("./utils/generate-hash.js")();
    this.ee = ee({});
    this.state = "closed";
    this.activateLinks();
};
Modal.prototype.open = function(callBack) {
  this.lastFocus = document.activeElement;
  this.toggleContainerClass();
  if (!this.wrapper) {
    this.wrapper = document.createElement("div");
    this.wrapper.innerHTML = this.opts.template(this.opts.data);
    this.wrapper.classList.add(this.opts.classes.modalWrapper);
  }
  this.opts.container.appendChild(this.wrapper);
  this.wrapper.setAttribute('aria-hidden', 'false');
  this.wrapper.setAttribute('tabindex', '0');
  this.wrapper.focus();
  this.addCloseListeners();
  if (callBack) { callBack() }
  this.state = "open";
  this.ee.emit("open");
};
Modal.prototype.addCloseListeners = function() {
  var self = this;
  var listener;
  forEach(document.querySelectorAll("."+this.opts.classes.closeButton), function(el) {
    el.removeEventListener("click", listener);

    el.addEventListener("click", listener = function(event) {
      self.close(event);
    });
  });
  self.opts.container.addEventListener("keydown", function(event) {
    self.close(event);
  });
  self.wrapper.addEventListener('click', function( e ) {
    if (e.target == self.wrapper) {
       self.close( e );
     }
  }, false);
}
Modal.prototype.close = function(event) {
  var self = this;
  if (self.state == "open" && ( !event.keyCode || event.keyCode === 27 ) ) {

    this.wrapper.setAttribute('aria-hidden', 'true');
    this.wrapper.setAttribute('tabindex', '-1');
    this.lastFocus.focus();
    this.opts.container.removeChild(this.wrapper);
    this.toggleContainerClass(true);
    self.state = "closed";
    self.ee.emit("close");
  }
};
Modal.prototype.toggleContainerClass = function(toggle) {
  if (!toggle && !this.opts.container.classList.contains(this.opts.classes.container)) {
    this.opts.container.classList.add(this.opts.classes.container);
  }
  else if(toggle && this.opts.container.classList.contains(this.opts.classes.container)) {
    this.opts.container.classList.remove(this.opts.classes.container);
  }
};
Modal.prototype.activateLinks = function() {
  var self = this;
  if (typeof this.opts.links === "Array") {
    forEach(this.opts.links, function(linkEl) {
      var linkCB;
      linkEl.removeEventListener("click",linkCB);
      linkEl.addEventListener("click",linkCB = function() {
        self.open();
      });
      linkEl.setAttribute("data-modal-id",self.opts.id);
    });
  }
  else {
    var linkCB;
    this.opts.links.removeEventListener("click",linkCB);
    this.opts.links.addEventListener("click",linkCB = function() {
      self.open();
    });
    this.opts.links.setAttribute("data-modal-id",self.opts.id);
  }
};
module.exports = Modal;
/*
// helper function to place modal window as the first child
// of the #page node
var m = document.getElementById('modal_window'),
    p = document.getElementById('page');

function swap () {
  p.parentNode.insertBefore(m, p);
}

swap();


// modal window
(function() {

  'use strict';

  // list out the vars
  var mOverlay = getId('modal_window'),
      mOpen = getId('modal_open'),
      mClose = getId('modal_close'),
      modal = getId('modal_holder'),
      allNodes = document.querySelectorAll("*"),
      modalOpen = false,
      lastFocus,
      i;
  var opts = {
      mOverlay :
  }

  // Let's cut down on what we need to type to get an ID
  function getId ( id ) {
    return document.getElementById(id);
  }


  // Let's open the modal
  function modalShow () {
    lastFocus = document.activeElement;
    mOverlay.setAttribute('aria-hidden', 'false');
    modalOpen = true;
    modal.setAttribute('tabindex', '0');
    modal.focus();
  }


  // binds to both the button click and the escape key to close the modal window
  // but only if modalOpen is set to true
  function modalClose ( event ) {
    if (modalOpen && ( !event.keyCode || event.keyCode === 27 ) ) {
      mOverlay.setAttribute('aria-hidden', 'true');
      modal.setAttribute('tabindex', '-1');
      modalOpen = false;
      lastFocus.focus();
    }
  }


  // Restrict focus to the modal window when it's open.
  // Tabbing will just loop through the whole modal.
  // Shift + Tab will allow backup to the top of the modal,
  // and then stop.
  function focusRestrict ( event ) {
    if ( modalOpen && !modal.contains( event.target ) ) {
      event.stopPropagation();
      modal.focus();
    }
  }


  // Close modal window by clicking on the overlay
  mOverlay.addEventListener('click', function( e ) {
    if (e.target == modal.parentNode) {
       modalClose( e );
     }
  }, false);


  // open modal by btn click/hit
  mOpen.addEventListener('click', modalShow);

  // close modal by btn click/hit
  mClose.addEventListener('click', modalClose);

  // close modal by keydown, but only if modal is open
  document.addEventListener('keydown', modalClose);

  // restrict tab focus on elements only inside modal window
  for (i = 0; i < allNodes.length; i++) {
    allNodes.item(i).addEventListener('focus', focusRestrict);
  }

})();


<div id="page">

      <div class="menu">
        <button class="btn" type="button" id="modal_open">Open the Modal</button>
      </div>

      <article class="content-area">

        <h1>
          Demo:<br />
          An accessible Modal Window with JavaScript &amp; CSS
        </h1>

        <p>
          This modal window is made with plain old semantic mark-up, CSS and
          a very little bit of JavaScript.
        </p>

        <p>
          Check out the <a href="http://codepen.io/scottohara/pen/lIdfv">source code on codepen</a> to see how it works!
        </p>

        <form action="#">
          <label for="test" class="label">Label for Input</label>
          <input type="text" id="test" class="input" />

          <label for="test2" class="label">Label for Second Input</label>
          <input type="text" id="test2" class="input" />

          <label for="test3" class="label">Label for Third Input</label>
          <input type="text" id="test3" class="input" />
        </form>

        <p>
          Here's a link to the
          <a href="https://en.wikipedia.org/wiki/Modal_window">wikipedia entry on modal windows</a>.
        </p>
      </article> <!-- end .content-area -->
    </div> <!-- end #page -->

    <div class="modal-overlay" id="modal_window"
             aria-hidden="true" role="dialog"
             aria-labelledby="modal_title">

      <div class="modal-content" id="modal_holder" role="document">

          <h1 id="modal_title">Modal Title</h1>
          <form>
            <label for="name">Name:</label>
            <input type="text" id="name" class="input" placeholder="Gimmie ur Name" />

            <label for="email">Email:</label>
            <input type="email" id="email" class="input" placeholder="Gimmie ur Email" />

            <input type="submit" class='btn' value="Submit Form" />
          </form>

        <button class="btn-close" id="modal_close" type="button" aria-label="close">
          &times;
        </button>

      </div> <!-- end .modal-content -->

    </div> <!-- end .modal-overlay -->
*/
