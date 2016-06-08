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
  listeners: {
    all: {
      queue: []
    }
  },
  // assigns callbacks to keys on object
  watch: function(key, cb){
    key = key === '.' || undefined ? 'all' : key;

    if (typeof key === 'function'){
      cb = key
      key = 'all'
    }

    if (!this.listeners[key]){
      this.listeners[key] = {
        queue: []
      };
    }

    this.listeners[key].queue.push(cb);
  },
  // run all callbacks in specific queue
  publish: function(key, val){
    if (this.listeners.all.queue.length > -1){
      for (var i = 0; i < this.listeners.all.queue.length; i++){
        this.listeners.all.queue[i](val);
      }
    }

    // if a callback hasn't been specified yet, return
    if (!this.listeners[key]) return;

    // run callback with changed value as param
    for (var i = 0; i < this.listeners[key].queue.length; i++){
      this.listeners[key].queue[i](val);
    }
  }
}

function deepSet(source, target, key, keys){
  target.store[key].store = {}

	keys.forEach(function(k){
		Object.defineProperty(target[key], k, { 
			set: function(val){ 
        target.store[key].store[k] = val;

				target.publish(key+'.'+k, val);
			},
			get: function(){
        return target.store[key].store[k]
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
function Lookout(source){
  var target;

  if (!isObj(source)) return console.log('%cPassed parameter ('+source+') is not an object.', 'background-color:#ff4567;color:#333333');

  target = Object.create(proto, {
    store: {
      value: source 
    }
  });

  Object.assign(target, source)

  Object.keys(source).forEach(function(key){
    if (isObj(source[key])){
      childObjKeys = Object.keys(source[key]);
      deepSet(source, target, key, childObjKeys);
    }

    Object.defineProperty(target, key, { 
      set: function(val){ 
        this.store[key] = val;
        this.publish(key, val);
      },
      get: function(){
        return this.store[key]
      },
      configurable: true
    });
  });

  return target;
}

module.exports = Lookout;

