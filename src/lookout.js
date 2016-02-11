var isObj = require('is-plain-object');

/**
 * Added as a prototype to each 
 * object created with Lookout()
 */
var proto = {
  // cache of callback functions
  listeners: {},
  // assigns callbacks to keys on object
  watch: function(key, cb){
    var key = key || 'all'; // TODO: write 'all' functionality 

    if (!this.listeners[key]){
      this.listeners[key] = {
        queue: []
      };
    }

    this.listeners[key].queue.push(cb);
  },
  // run all callbacks in specific queue
  publish: function(key, val){
    // if a callback hasn't been specified yet, return
    if (!this.listeners[key]) return;

    // run callback with changed value as param
    this.listeners[key].queue.forEach(function(fn, i){
      fn(val);
    });
  }
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
    props: {
      value: source 
    }
  });

  Object.keys(source).forEach(function(key){
    Object.defineProperty(target, key, { 
      set: function(val){ 
        this.props[key] = val;
        this.publish(key, val);
      },
      get: function(){
        return this.props[key]
      }
    });
  });

  return target;
}

return Lookout;
