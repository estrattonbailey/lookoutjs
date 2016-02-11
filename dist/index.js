(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.index || (g.index = {})).js = f()}})(function(){var define,module,exports;
var isObj = require('is-plain-object');

var proto = {
  // cache of callback functions
	listeners: {},
  // assigns callbacks to keys on object
	watch: function(key, cb){
		var key = key || 'all';
		
    if (!this.listeners[key]){
      this.listeners[key] = {
        queue: []
      };
    }
		
		this.listeners[key].queue.push(cb);
	},
  // run all callbacks in specific queue
	publish: function(key, val){
    console.log(key)
    if (!this.listeners[key]) return;

		this.listeners[key].queue.forEach(function(fn, i){
			fn(val);
		});
	}
}

function deepSet(source, target, key, keys){
  // console.log(target)
	keys.forEach(function(k){
    // console.log(target.props[key][k])
		Object.defineProperty(target[key], k, { 
			set: function(val){ 
        console.log(k)
        console.log(target.props[key])
        target.props[key][k] = val;

				this.publish(key, val);
			},
			get: function(){
        return target.props[key][k]
			}
		});
  });
}

/**
 * Create blank object with proto methods.
 * Create getters and setters for each property.
 * Setter fires this.publish() callback function.
 * @param {object} obj Any object the user wants to create
 */
function Lookout(source){
  var target,
      childObj,
      childObjKeys;
  
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

    childObj = isObj(source[key]);

    if (childObj){
      childObjKeys = Object.keys(source[key]);
      deepSet(source, target, key, childObjKeys);
    }
	});
	
	return target;
}

return Lookout;

});
