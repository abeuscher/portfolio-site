var parseHTML = function(str) {
  var tmp = document.createElement("div");
  tmp.innerHTML = str;
  return tmp.children[0];
};
module.exports = parseHTML;
