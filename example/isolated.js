"use strict";

const wevent = require("../index.js");

// Create a new isolated wevent isolatedWevent
const isolatedWevent = new wevent.Wevent();

// Create object to tie to
const obj = {};

let count = 0;
// Create event listener
const eventListener = () => count++;

// Register listener on global wevent
wevent.on(obj, eventListener);
// Register listener on isolatedWevent wevent
isolatedWevent.on(obj, eventListener);
// Emit in isolatedWevent
isolatedWevent.emit(obj).then(() => {
  if (count !== 1) throw new Error("Should have been emitted only once!");
  return wevent.emit(obj);
}).then(() => {
  if (count !== 2) throw new Error("Should now have been emitted twice!");
});
