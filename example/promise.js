"use strict";

const Wevent = require("../index.js");

const on = Wevent.on;
const off = Wevent.off;
const emit = Wevent.emit;

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

