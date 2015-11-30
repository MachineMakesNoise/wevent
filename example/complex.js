"use strict";

const wevent = require("../index.js");

const on = wevent.on;
const off = wevent.off;
const emit = wevent.emit;

let count = 0;
/*
  Define event listener function that re-emits if count < 4, on each odd count
  a regular emit is returned, on even a promise is.
 */
const eventListener = () => {
  count++;
  if (count < 4) {
    return count % 2 === 0 ?
      new Promise((resolve) => setTimeout(() => resolve(emit), 250))
        :
      emit;
  }
  else {
    return new Promise((resolve) => resolve(off));
  }
};
// Define handle
const handle = {};
// Attach event listener to handle
on(handle, eventListener);
// Emit to handle
emit(handle).
  then(() => emit(handle)).
  then(() => {
    // Check result
    if (count !== 4) console.log("Shouldn't be!");
  });

