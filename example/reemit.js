"use strict";

const Wevent = require("../index.js");

const on = Wevent.on;
const off = Wevent.off;
const emit = Wevent.emit;

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

