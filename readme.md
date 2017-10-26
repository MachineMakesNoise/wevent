# wevent

Weak event system for ES6.

## Features

* For node and browser. To use with node directly use version 5.0.0 or above.
 For browsers or older node use babel/polyfills/shims - just make sure WeakMap
 natively supported for maximum efficiency.
* Promise based. Event listener can result in promise for async flow - 
not required
* No string handles/slots. Handles/slots are objects.
* Based on WeakMap. This means that attaching itself does not create references, 
**however** event listeners themselves usually create references so remember to 
*off* unneeded event listeners.
* Complex event listener control flows. These are managed by returning *wevent* 
functions from event listener (e.g. possible to do "once", "re-emitting" or 
similar more "complex" event listeners).
* Small (<250 lines with comments), no runtime dependencies
* Does not pollute either target or listener
* Can be used to create isolated event listener system
* wevent functions (on/off/emit) emit as well, these are listenable

## API

Whole API consists of three function, see [api.md](api.md) for complete 
documentation.

## Example

```js
"use strict";

const wevent = require("../index.js");

const on = wevent.on;
const off = wevent.off;
const emit = wevent.emit;
const getEventListenerCount = wevent.getEventListenerCount;

let message = "";
let count = 0;
// Define event listener function
const eventListener = (msg) => message = msg;
// Define handle
const handle = {};
// Attach event listener to handle
on(handle, eventListener);
// Check count
count = getEventListenerCount(handle);
if (count !== 1) throw new Error();
count = getEventListenerCount(handle, eventListener);
if (count !== 1) throw new Error();
// Emit to handle
emit(handle, "Hello world!").then((result) => {
  // Check results
  if (result !== 1) console.log("Shouldn't be!");
  if (message !== "Hello world!") console.log("Shouldn't be!");
  // Remove event listener
  off(handle, eventListener);
  // Check count
  count = getEventListenerCount(handle);
  if (count !== 0) console.log("Shouldn't be!");
  count = getEventListenerCount(handle, eventListener);
  if (count !== 0) console.log("Shouldn't be!");
});
```

This and few more example in [example](example) directory.

## License

[Apache 2.0](LICENSE)

## Changes

### 30.11.2015 - 0.3.0

<pre>
* Fixed examples
* Fixed typos
* Cleaned more code
* Now exports the class as default export and uses static function of the class for global wevent instance, does not pollute window or global anymore.
+ Typescript d.ts 
</pre>

### 30.11.2015 - 0.2.0

<pre>
* Fixed examples …
+ Documentation for listening wevent functions
* Cleaned code …
* Off now results in boolean …
* Line count to reflect changes
* Own bind function to store original function used to resolve the re… …
* Upgraded jsdoc-to-markdown because it crashed building doc …
* fixed count calculating same entries correct …
- Unnecessary error reject. 
</pre>

### 31.10.2015 - 0.1.1

<pre>
* Corrected emitArguments to be variable length argument list
* Changed description to match that of github 
</pre>

### 31.10.2015 - 0.1.0

<pre>
* Bump to version 0.1.0, first public release
</pre>