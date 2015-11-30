"use strict";

const wevent = require("../index.js");

const on = wevent.on;
const off = wevent.off;
const emit = wevent.emit;

const obj = { };
let offFunction;
const eventListener = (_, arg) => {
  if (arg !== obj) return;
  console.log("Great success!")
  offFunction();
};
offFunction = on(emit, eventListener);
emit(obj);
