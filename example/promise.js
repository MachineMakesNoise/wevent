"use strict";

const wevent = require("../index.js");

const on = wevent.on;
const off = wevent.off;
const emit = wevent.emit;
const getEventListenerCount = wevent.getEventListenerCount;

let message = "";
// Define event listener function that return promise
const eventListener = (msg) => new Promise((resolve) =>
  setTimeout(() => resolve(message = msg), 500));

// Define handle
const handle = {};
// Attach event listener to handle
on(handle, eventListener);
// Emit to handle
emit(handle, "Hello world!").
  then(() => {
    // Check result
    if (message !== "Hello world!") console.log("Shouldn't be!");
  });

