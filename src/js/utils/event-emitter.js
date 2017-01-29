//set up event handlers
var getDefaults = require("lodash/defaults");
var forEach = require("lodash/forEach");
var generateHash = require("./generate-hash.js");
var getFunctionName = require("./get-function-name.js");

var defaults = {
    applyArrayData : false
};

function EventEmitter(opts) {
    opts = getDefaults(opts || {}, defaults);
    this.eventHandlers = {};
    this.boundObjects = {};
    this.applyArrayData = opts.applyArrayData;
}

function getObjKey(haystack, needle) {
    for (var i in haystack) {
        if (haystack[i] == needle) {
            return i;
        }
    }
    return null;
}

EventEmitter.prototype.on = function(boundTo, eventName, func){
    if (arguments.length == 2) {
        func = eventName
        eventName = boundTo;
        boundTo = window;
    }
    var objKey = getObjKey(this.boundObjects, boundTo);
    if (objKey === null) {
        objKey = generateHash();
        this.boundObjects[objKey] = boundTo;
    }
    if (Array.isArray(eventName)) {
        var self = this;
        forEach(eventName, function(evt){
            self.bindToEvent(objKey, evt, func);
        });
    } else {
        this.bindToEvent(objKey, eventName, func);
    }
};

EventEmitter.prototype.bindToEvent = function(objKey, eventName, func) {
    if (!this.eventHandlers[eventName]) {
        this.eventHandlers[eventName] = {};
    }
    if (!this.eventHandlers[eventName][objKey]) {
        this.eventHandlers[eventName][objKey] = {};
    }
    var funcName = getFunctionName(func) || Object.keys(this.eventHandlers[eventName][objKey]).length;
    this.eventHandlers[eventName][objKey][funcName] = func;
};

EventEmitter.prototype.trigger = function(object, eventName, eventObj, applyArray){
    if (arguments.length == 2) {
        if (typeof object == "string") {
            eventObj = eventName;
            eventName = object;
            object = window;
        }
    }
    if (arguments.length == 1) {
        eventName = object;
        object = window;
    }
    var key = getObjKey(this.boundObjects, object);
    if (this.eventHandlers[eventName]) {
        if (this.eventHandlers[eventName][key]) {
            for (var callbackName in this.eventHandlers[eventName][key]) {
                if ((this.applyArrayData || applyArray) && utils.isArrayLike(eventObj)) {
                    this.eventHandlers[eventName][key][callbackName].apply(object, eventObj);
                } else {
                    this.eventHandlers[eventName][key][callbackName].call(object, eventObj);
                }
            }
        }
    }
};

EventEmitter.prototype.off = function(object, eventName, funcName){
    if (arguments.length == 2) {
        // 2 arguments - event name and and func name
        funcName = eventName
        eventName = object;
        object = window;
    }
    if (arguments.length == 1) {
        // 1 argument - event name
        eventName = object;
        object = window;
    }
    var objKey = getObjKey(this.boundObjects, object);
    if (Array.isArray(eventName)) {
        var self = this;
        utils.forEach(eventName, function(evt){
            self.unbindFromEvent(objKey, evt, funcName);
        });
    } else {
        this.unbindFromEvent(objKey, eventName, funcName);
    }
};

EventEmitter.prototype.extend = function(obj) {
  var methods = ["on", "trigger", "off"];
  var self = this;
  utils.forEach(methods, function(method){
    obj[method] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof arguments[0] != "object") {
          args.unshift(obj);
      }
      self[method].apply(self, args);
    };
  });
};

EventEmitter.prototype.unbindFromEvent = function(objKey, eventName, funcName) {
    if (this.eventHandlers[eventName]) {
        if (this.eventHandlers[eventName][objKey]) {
            if (funcName) {
                delete this.eventHandlers[eventName][objKey][funcName];
            } else {
                delete this.eventHandlers[eventName][objKey];
            }
        }
    }
};

module.exports = EventEmitter;
