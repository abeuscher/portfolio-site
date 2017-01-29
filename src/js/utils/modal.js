var getDefaults = require("lodash/defaults");
var parseHTML = require("./parse-html.js");

var default_opts = {
  "template":require("../components/generic-modal.pug"),
  "button":"",
  "animation":"",
  "listenerClass" : ".thumb",
  "bodyClass" : "modal-open",
  "data" : {
    "title" : "Sample title",
    "content" : "<p>Sample content</p>"
  },
  "state":"closed"
};

var Modal = function(opts) {
    var self = this;
    self.opts = getDefaults(opts,default_opts);
    self.el = parseHTML(self.opts.template(self.opts.data));
    self.el.state = self.opts.state;
    self.opts.button.addEventListener("click", function() {
        self.open();
    });
    self.open = function() {
      document.body.classList.add(self.opts.bodyClass);
      document.body.appendChild(self.el);
      if (self.opts.cb) {
        self.opts.cb(self.opts.siblings);
      }
      self.state = "open";
      self.el.removeEventListener("click", self.close);
      self.el.addEventListener("click", self.close);
    };
    self.close = function() {
      self.el.removeEventListener("click", self.close);
      document.body.classList.remove(self.opts.bodyClass);
      if (self.el && self.el.parentNode==document.body) {
        document.body.removeChild(self.el);
      }
      self.state = "closed";
    };

};
module.exports = Modal;
