"use strict";

const wevent = require("../index.js");

const on = wevent.on;
const off = wevent.off;
const emit = wevent.emit;
const getEventListenerCount = wevent.getEventListenerCount;

let message = "";
// Define event listener function that removes the event listener after run
const eventListener = (msg) => {
  message = msg;
  return off;
};
// Define handle
const handle = {};
// Attach event listener to handle
on(handle, eventListener);
// Emit to handle twice, only first one should matter
emit(handle, "Hello world!").
  then(() => emit(handle, "Hello another world!")).
  then(() => {
    // Check result
    if (message !== "Hello world!") console.log("Shouldn't be!");
  });

