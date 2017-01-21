var forEach = require("lodash/foreach");
//require("angular");
var modal = require("./components/modal.pug");
window.addEventListener("load", function() {
  $els = document.querySelectorAll('.thumb');
  forEach($els, function(val) {
    val.setAttribute("style","background:url('"+val.getAttribute("data-bg")+"') no-repeat center top; background-size:cover;");
    val.addEventListener("click", function() {
      var data = JSON.parse(this.getAttribute("data-info"));

      var thismodal = parseHTML(modal(data));
      document.body.appendChild(thismodal);
      thismodal.addEventListener("click", function() {
        document.body.removeChild(this);
      });
    });
  });
});
var parseHTML = function(str) {
  var tmp = document.createElement("div");
  tmp.innerHTML = str;
  return tmp.children[0];
};
/*
.contact.grid
  .row
    .col-12-s
      h1=locals.sections[2].title
    .col-12-s
      form(name=sections[2].form.title,method=sections[2].form.method,target=sections[2].form.target)
        each field in sections[2].form.fields
          .row.pad
            .col-12-s
          label=field.label
            if field.type=="textarea"
              textarea(name=field.fieldname,placeholder=field.placeholder)
            else
              input(type=field.type,name=field.fieldname,placeholder=field.placeholder)

, {
    "title": "contact",
    "intro": "Please fill out form",
    "form": {
        "title": "contact",
        "target": "#",
        "method": "post",
        "fields": [{
            "label": "name",
            "fieldname": "name",
            "placeholder": "your name",
            "type": "text",
            "required": false
        }, {
            "label": "email",
            "fieldname": "email",
            "placeholder": "your email",
            "type": "email",
            "required": true
        }, {
            "label": "message",
            "fieldname": "message",
            "placeholder": "a message",
            "type": "textarea",
            "required": true
        }]
    }
}
*/
