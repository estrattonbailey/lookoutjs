/**
 * TODO
 * 2. console.warn
 * 3. Add whitespace
 * 4. Precompile deps
 * 5. bundleDependencies[]
 */

/**
 * Check if object and
 * not an Array
 */
var isObj = require('isobject');

/**
 * Get keypaths to fire in
 * this.publish()
 */
var getPath = require('object-keypath');

/**
 * Root object
 */
var ROOT;

/**
 * Create prototype chain for
 * ROOT object.
 *
 * NOTE: properties should be enumerable
 */
var proto = Object.create({}, {

  /**
   * Cache of callback functions
   */
  listeners: {
    value: {
      all: {
        queue: []
      }
    },
    enumerable: false
  },

  /**
   * Assigns callbacks to changes
   * at a specified keypath
   *
   * @param {string} key Full keypath to target key
   * @param {object} cb Callback function
   */
  watch: {
    value: function(key, cb){
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
    enumberable: false
  },

  /**
   * Run all callbacks at a certain
   * keypath key in the this.listeners array
   *
   * @param {string} key Full keypath to target key
   * @param {string|object} val Value that changed, passed to callback 
   */
  publish: {
    value: function(key, val){
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
    },
    enumerable: false
  }
});

/**
 * Generate accessors
 *
 * @param {object} root Context object
 * @param {object} srouce Data object
 * @param {string} key Key to be set
 */
function set(root, source, key){
  if (!root.store){
    Object.defineProperty(root, 'store', {
      value: {},
      enumerable: false 
    })
    root.store[key] = source 
  }

  // Recusively set objects
  if (isObj(source)){
    Object.keys(source).forEach(function(k){
      set(source, source[k], k)
    })
  }

  Object.defineProperty(root, key, { 
    set: function(val){ 
      root.store[key] = val;

      var keypath = getPath(ROOT, key, val);

      /**
       * For keypaths, fire callbacks for 
       * each sub path in case we have
       * listeners on those keypaths
       */
      keypath.split(/\./).forEach(function(path){
        ROOT.publish(keypath, val);
        if (keypath.match(/\./)){
          keypath = keypath.substring(0, keypath.match(/\.(?!.*\.)/).index)
        }
      })
    },
    get: function(){
      return root.store[key]
    },
    configurable: true
  });
}

/**
 * Create blank object with proto methods.
 *
 * @param {object} source Any object the user wants to create
 */
function Lookout(source){
  if (!isObj(source)) {
    return console.warn('Passed parameter ('+source+') is not an object.')
  }

  ROOT = Object.create(proto, {
    store: {
      value: source 
    }
  });

  Object.assign(ROOT, source)

  Object.keys(source).forEach(function(key){
    set(ROOT, source[key], key)
  });

  return ROOT;
}

module.exports = Lookout;

