"use strict";

const wevent = require("../index.js");

const on = wevent.on;
const off = wevent.off;
const emit = wevent.emit;

let sharedCount = 0;

class TestClass {
  constructor() {
    this.handle =  {};
    this.count = 0;
    this.sharedCount = 0;
  }

  classFunction() {
    // Something here
    return emit(this.classFunction);
  }

}

// Define event listener function
const eventListener = (instance) => instance.count++;
const sharedEventListener = () => sharedCount++;
// Create instances
const a = new TestClass();
const b = new TestClass();
// Attach event listener to handles
on(a.handle, eventListener);
on(b.handle, eventListener);
// Note here we attach to not an isolatedWevent handle that is created on constructor,
// we attach to function defined in class. To make isolatedWevent functions "unique"
// either wrap, bind or similar to create a unique isolatedWevent of that function to
// bind to
on(TestClass.prototype.classFunction, eventListener);
// Emit to handles
Promise.all([
  emit(a.handle, a),
  emit(a.handle, a),
  emit(a.handle, a),
  emit(b.handle, b),
  emit(b.handle, b),
  b.classFunction(),
  a.classFunction(),
  a.classFunction(),
  a.classFunction(),
  b.classFunction()
]).
  then(() => {
    // Check result
    if (a.count !== 3) console.log("Shouldn't be!");
    if (b.count !== 2) console.log("Shouldn't be!");
    if (sharedCount !== 5) console.log("Shouldn't be!");
  });


