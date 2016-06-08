(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Lookout = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isObject = require('isobject');

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

module.exports = function isPlainObject(o) {
  var ctor,prot;
  
  if (isObjectObject(o) === false) return false;
  
  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;
  
  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;
  
  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }
  
  // Most likely a plain Object
  return true;
};

},{"isobject":2}],2:[function(require,module,exports){
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function isObject(val) {
  return val != null && typeof val === 'object'
    && !Array.isArray(val);
};

},{}],3:[function(require,module,exports){
'use strict';

/**
 * TODO
 * 1. JSDoc
 * 2. console.warn
 * 3. Add whitespace
 * 4. Precompile deps
 * 5. bundleDependencies[]
 */

var isObj = require('is-plain-object');

/**
 * Added as a prototype to each 
 * object created with Lookout()
 */
var proto = {
  // cache of callback functions
  listeners: {},
  // assigns callbacks to keys on object
  watch: function watch(key, cb) {
    key = key === '.' || undefined ? 'all' : key;

    if (typeof key === 'function') {
      cb = key;
      key = 'all';
    }

    if (!this.listeners[key]) {
      this.listeners[key] = {
        queue: []
      };
    }

    this.listeners[key].queue.push(cb);
    console.log(this.listeners);
  },
  // run all callbacks in specific queue
  publish: function publish(key, val) {
    console.log(key);
    // if (this.listeners['all'].queue){
    //   for (var i = 0; i < this.listeners['all'].queue.length; i++){
    //     this.listeners['all'].queue[i](val);
    //   }
    // }

    // if a callback hasn't been specified yet, return
    if (!this.listeners[key]) return;

    // run callback with changed value as param
    for (var i = 0; i < this.listeners[key].queue.length; i++) {
      this.listeners[key].queue[i](val);
    }
  }
};

function deepSet(source, target, key, keys) {
  keys.forEach(function (k) {
    Object.defineProperty(target[key], k, {
      set: function set(val) {
        target.store.root[key][k] = val;

        this.publish(key, val);
      },
      get: function get() {
        return target.store.root[key][k];
      }
    });
  });
}

/**
 * Create blank object with proto methods.
 * Set props data bucket equal to passed source object.
 * Create getters and setters for each property.
 * Setter fires this.publish() callback function.
 * @param {object} source Any object the user wants to create
 */
function Lookout(source) {
  var target;

  if (!isObj(source)) return console.log('%cPassed parameter (' + source + ') is not an object.', 'background-color:#ff4567;color:#333333');

  target = Object.create(proto, {
    store: {
      value: {
        root: source
      }
    }
  });

  // TODO Try defining obj first, then moving up the object to define accessors
  Object.keys(source).forEach(function (key) {
    childObj = isObj(source[key]);

    if (childObj) {
      childObjKeys = Object.keys(source[key]);
      deepSet(source, target, key, childObjKeys);
    }

    Object.defineProperty(target, key, {
      set: function set(val) {
        this.store.root[key] = val;
        this.publish(key, val);
      },
      get: function get() {
        return this.store.root[key];
      },
      configurable: true
    });
  });

  return target;
}

module.exports = Lookout;

},{"is-plain-object":1}]},{},[3])(3)
});