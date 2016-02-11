# Lookout.js (WIP)
*A tiny observable library in JS using native ES5 getters and setters. 541 bytes minified and gzipped.*

This library is a work in progress. Currently the observable functionality is limited to the first 'level' of an object, meaning nested properties do not have discrete watch functionality. It's up for debate whether it should support nesting of properties or not.

## Todo
1. Allow watching of nested object properties i.e. `Lookout.watch('user.meta', function(){})`.
2. Add test.
3. Browser testing (should be clear back to at least IE9, it's all ES5).
4. Add/remove functionality?
  - Since the objects are probably used to store state and value data, the need for this may be out of scope, since a user should simply define those properties when creating the Lookout object. 

## Getting Started
Lookout is packaged with UMD, so you can include it via `require()` or as a script tag in your markup.
```bash
npm i lookoutjs
```
```javascript
var lookout = require('lookoutjs');
```

## API
The library is *lazy*, i.e. it won't build listener queues or fire any callbacks until they are defined.

Simply pass the object you want to observe to Lookout, and then call `watch()` on a property to define a callback function to fire when that value changes.
```javascript
// Create observable object
var user = lookout({
  firstName: 'Eric',
  lastName: 'Bailey',
  meta: {
    birthday: '1992-02-14',
    height: 73
  }
});

// Assign callbacks to keys in the object
user.watch('firstName', function(val){
  console.log('First name changed to '+val);
});
user.watch('firstName', function(val){
  console.log('You can assign more than one listener callback function to a value');
});
user.watch('meta', function(val){
  console.log('Meta data updated!');
});

// Change key values
user.firstName = 'Ryan';
user.meta = {
  birthday: '1990-05-08',
  height: 72
};
user.meta.height = 65;

// Result
// 'First name changed to Ryan'
// 'You can assign more than...'
// 'Meta data updated!'
// 'Meta data updated!'
```
