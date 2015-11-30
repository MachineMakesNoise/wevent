"use strict";

const wevent = require("../index.js");

const on = wevent.on;
const off = wevent.off;
const emit = wevent.emit;
const count = wevent.count;

let message = "";
let listenerCount = 0;
// Define event listener function
const eventListener = (msg) => message = msg;
// Define handle
const handle = {};
// Attach event listener to handle
on(handle, eventListener);
// Check count
listenerCount = count(handle);
if (listenerCount !== 1) throw new Error();
listenerCount = count(handle, eventListener);
if (listenerCount !== 1) throw new Error();
// Emit to handle
emit(handle, "Hello world!").then((result) => {
  // Check results
  if (result !== 1) console.log("Shouldn't be!");
  if (message !== "Hello world!") console.log("Shouldn't be!");
  // Remove event listener
  off(handle, eventListener);
  // Check count
  listenerCount = count(handle);
  if (listenerCount !== 0) console.log("Shouldn't be!");
  listenerCount = count(handle, eventListener);
  if (listenerCount !== 0) console.log("Shouldn't be!");
});