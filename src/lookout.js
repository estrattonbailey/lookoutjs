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
		this.listeners[key].queue.forEach(function(fn, i){
			fn(val);
		});
	}
}

/**
 * Create blank object with proto methods.
 * Create getters and setters for each property.
 * Setter fires this.publish() callback function.
 * @param {object} obj Any object the user wants to create
 */
function Lookout(obj){
	var _o = Object.create(proto);
	
	Object.keys(obj).forEach(function(key){
		_o[key] = obj[key];
		
		Object.defineProperty(_o, key, { 
			set: function(val){ 
				Object.defineProperty(this, key, {
					value: val
				});
				
				this.publish(key, val);
			},
			get: function(){
        return obj[key]
			}
		});
	});
	
	return _o;
}

return Lookout;
