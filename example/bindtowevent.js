"use strict";

const Wevent = require("../index.js");

const on = Wevent.on;
const off = Wevent.off;
const emit = Wevent.emit;

const obj = { };
let offFunction;
const eventListener = (_, arg) => {
  if (arg !== obj) return;
  console.log("Great success!");
  offFunction();
};
offFunction = on(emit, eventListener);
emit(obj);
