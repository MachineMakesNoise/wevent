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