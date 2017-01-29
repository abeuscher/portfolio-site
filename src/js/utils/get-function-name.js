getFunctionName = function(fun) {
    var arr = /^function\s+([\w\$]+)\s*\(/.exec(fun.toString());
    return arr ? arr[1] : null;
};
module.exports = getFunctionName;
