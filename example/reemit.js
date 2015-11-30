"use strict";

const wevent = require("../index.js");

const on = wevent.on;
const off = wevent.off;
const emit = wevent.emit;

let count = 0;
// Define event listener function re-emits if count < 3
const eventListener = () => {
  count++;
  return count < 3 ? emit : off;
};
// Define handle
const handle = {};
// Attach event listener to handle
on(handle, eventListener);
// Emit to handle
emit(handle).
  then(() => {
    // Check result
    if (count !== 3) console.log("Shouldn't be!");
  });

