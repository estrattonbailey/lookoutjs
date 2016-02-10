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
    if (!this.listeners[key]) return;

		this.listeners[key].queue.forEach(function(fn, i){
			fn(val);
		});
	}
}

function deepSet(source, target, key, keys){
  keys.forEach(function(k){
    target[key][k] = source[key][k];

    Object.defineProperty(target[key], k, { 
      set: function(val){ 
        Object.defineProperty(this, k, {
          value: val
        });

        target.publish(k, val);
      },
      get: function(){
        return source[key][k]
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
  var children,
      target = Object.create(proto);
	
	Object.keys(source).forEach(function(key){
		target[key] = source[key];

    children = source[key];
		
		Object.defineProperty(target, key, { 
			set: function(val){ 
				Object.defineProperty(this, key, {
          value: val
				});

				this.publish(key, val);
			},
			get: function(){
        return source[key]
			}
		});

    if (typeof children === 'object'){
      deepSet(source, target, key, Object.keys(children));  
    }
	});
	
	return target;
}

return Lookout;
