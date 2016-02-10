# Lookout.js (WIP)
*A tiny observable library in JS using native ES5 getters and setters. 428b minified and gzipped, so far.*

This library is a work in progress. As of v0.0.1, specifying observing objects is limited to one 'level' deep.

## Todo
1. Allow watching of nested object properties i.e. `Lookout.watch('user.meta', function(){})`.
2. Add test.
3. Browser testing (should be clear back to at least IE9, it's all ES5).

## Getting Started
Lookout is packaged with UMD, so you can include it via `require()` or as a script tag in your markup.
```javascript
var lookout = require('lookoutjs');
```

## API
The library is *lazy*, i.e. it won't build listener queues or fire any callbacks until they are defined.

Simply pass the object you want to observe to Lookout, and then call `watch()` on a property to defined a callback function to fire when that value changes.
```javascript
var user = lookout({
  firstName: 'Eric',
  lastName: 'Bailey',
  meta: {
    birthday: '1992-02-14',
    height: 73
  }
});

user.watch('firstName', function(val){
  console.log('First name changed to '+val);
});
user.watch('firstName', function(val){
  console.log('You can assign more than one listener callback function to a value');
});
user.watch('meta', function(val){
  console.log('Meta data updated!');
});

user.firstName = 'Ryan';
user.meta = {
  birthday: '1990-05-08',
  height: 72
};

// Result
// 'First name changed to Ryan'
// 'You can assign more than...'
// 'Meta data updated!'
```
