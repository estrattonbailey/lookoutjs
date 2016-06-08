/**
 * TODO
 * 1. JSDoc
 * 2. console.warn
 * 3. Add whitespace
 * 4. Precompile deps
 * 5. bundleDependencies[]
 */

var ROOT;
var isObj = require('is-plain-object');
var traverse = require('traverse');

/**
 * Added as a prototype to each 
 * object created with Lookout()
 */
var proto = Object.create({}, {
  // cache of callback functions
  listeners: {
    value: {
      all: {
        queue: []
      }
    },
    enumerable: false
  },
  // assigns callbacks to keys on object
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
  // run all callbacks in specific queue
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

function getPath(key, value){
  var PATH;

  function join(base, str){
    return base.match(/./) ? base+'.'+str : str
  }

  function _traverseDeep(path, obj){ // meta, meta{} 
    Object.keys(obj).forEach(function(k){
      if (k === 'store') return;

      if (isObj(obj[k])){
        _traverseDeep(join(path, k), obj[k]);
      }
      else if (k === key && obj[k] === value){
        PATH = join(path, k) 
      }
    })
  }

  function _traverse(obj){
    var path = '';

    Object.keys(obj).forEach(function(k){
      if (k === 'store') return;

      if (isObj(obj[k])){
        _traverseDeep(k, obj[k]); // meta, meta{}
      }
      else if (k === key && obj[k] === value){
        PATH = join(path, k)
      }
      else {
        PATH = 'all'
      }
    });
  };

  _traverse(ROOT)

  return PATH 
}

function set(root, source, key){
  if (!root.store){
    root.store = {}
    root.store[key] = source 
  }

  if (isObj(source)){
    Object.keys(source).forEach(function(k){
      set(source, source[k], k)
    })
  }

  Object.defineProperty(root, key, { 
    set: function(val){ 
      root.store[key] = val;

      ROOT.publish(getPath(key, val), val);
    },
    get: function(){
      return root.store[key]
    },
    configurable: true
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

