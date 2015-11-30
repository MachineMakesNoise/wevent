"use strict";

const EVENT_LISTENER_RESULT = [0];

/**
 * Simple bind function which preserves original function.
 * @private
 * @param {Function} fn Function to bind.
 * @param {*} thisArg Value to be used as this.
 * @return {Function} Bound function.
 */
function bindFunction(fn, thisArg) {
  const boundFunction = function() {
    return fn.apply(thisArg, arguments);
  };
  boundFunction._originalWeventFunction = fn;
  return boundFunction;
}

class Wevent {

  /**
   * Construct Wevent object
   * @param {WeakMap=} weakMap WeakMap to use as storage, mainly used for
   * global object.
   * @constructor
   */
  constructor(weakMap) {
    this._eventObjects = weakMap || new WeakMap();
    this.on = bindFunction(this.on, this);
    this.off = bindFunction(this.off, this);
    this.emit = bindFunction(this.emit, this);
    this.count = bindFunction(this.count, this);
  }

  /**
   * Get event listener array from weak map. Non exporter internal function.
   * @private
   * @param {Object} object Object to bind the event listener to.
   * @param {boolean=} create If no event listener map found, will it create it.
   * @return {Map<Function, Array<Function>>} Event listener entry.
   */
  _getEventListeners(object, create) {
    if (!(object instanceof Object))
      throw new Error(`Can only bind event listener to instance of "Object".`);
    let eventListeners = this._eventObjects.get(object);
    if (!eventListeners && create)
      this._eventObjects.set(object, eventListeners = new Map());
    return eventListeners;
  }

  /**
   * Recusive function that emits a single event listener.
   * @private
   * @param {Function} resolve Resolves to emitted count in the end.
   * @param {Function} reject Rejects to error.
   * @param {Object} object Object attached to event listener.
   * @param {number} emittedCount Current emitted count.
   * @param {Function} eventListener Event listener to fire.
   * @param {Array.<*>} emitArguments Arguments to pass to event listener
   * @return {Promise.<number>} Promise that resolves to emitted count.
   */
  _emitEventListener(resolve,
                     reject,
                     object,
                     emittedCount,
                     eventListener,
                     emitArguments) {
    try {
      return Promise.resolve(eventListener(...emitArguments)).
      then((result) => {
        emittedCount++;
        const originalWeventFunction = result && typeof
          result._originalWeventFunction !== "undefined" ?
          result._originalWeventFunction : result;
        switch (originalWeventFunction) {
        case Wevent.prototype.off :
          this.off(object, eventListener);
          break;
        case Wevent.prototype.emit :
          return setTimeout(() => this._emitEventListener(
            resolve,
            reject,
            object,
            emittedCount,
            eventListener,
            emitArguments
          ), 0);
        default :
          break;
        }
        resolve(emittedCount);
      }).catch((err) => reject(err));
    }
    catch (err) {
      reject(err);
    }
  }

  /**
   * Bind event listener to object.
   * @param {Object} object Object to bind the event listener to.
   * @param {Function} eventListener Event listener to bind.
   * @return {Function} Off function tied directly to recently bound
   * event listener.
   */
  on(object, eventListener) {
    if (!(eventListener instanceof Function))
      throw new Error(`Event listener must be of type "function"`);
    const eventListeners = this._getEventListeners(object, true);
    let eventListenerEntry = eventListeners.get(eventListener);
    if (!eventListenerEntry)
      eventListeners.set(eventListener, eventListenerEntry = { count: 0 });
    ++eventListenerEntry.count;
    const result = () => this.off(object, eventListener);
    this.emit(this.on, result, object, eventListener);
    return result;
  }

  /**
   * Unbind event listener on object.
   * @param {Object} object Object to unbind event listener from.
   * @param {Function=} eventListener Event listener to unbind, if none given
   * unbinds all event listeners on the given object.
   * @return {boolean} Did the off remove event listener(s).
   */
  off(object, eventListener) {
    const eventListeners = this._getEventListeners(object, false);
    let result = false;
    if (eventListeners) {
      let removeEventListenerObject = false;
      if (eventListener) {
        const eventListenerEntry = eventListeners.get(eventListener);
        if (result = (eventListenerEntry && --eventListenerEntry.count < 1))
          eventListeners.delete(eventListener);
        removeEventListenerObject = eventListeners.size < 1;
      }
      else {
        result = removeEventListenerObject = true;
      }
      if (removeEventListenerObject) this._eventObjects.delete(object);
    }
    this.emit(this.off, result, object, eventListener);
    return result;
  }

  /**
   * Emit an event on object.
   * @param {Object} object Object to emit to.
   * @param {...*} emitArguments Arguments to pass to event listeners.
   * @return {Promise} Promise when emit has finished on all event listeners.
   */
  emit(object) {
    const emitArguments = Array.prototype.slice.call(arguments, 1);
    let eventListenersResult = EVENT_LISTENER_RESULT;
    const eventListeners = this._getEventListeners(object, false);
    if (eventListeners) {
      const promises = [];
      eventListeners.forEach((eventListenerEntry, eventListener) => {
        for (let times = 0; times < eventListenerEntry.count; ++times) {
          promises.push(new Promise((resolve, reject) =>
            this._emitEventListener(
            resolve,
            reject,
            object,
            0,
            eventListener,
            emitArguments)));
        }
      });
      eventListenersResult = Promise.all(promises);
    }
    return Promise.resolve(eventListenersResult).then((results) =>
      results.reduce((previous, current) => previous + current, 0)).
        then((count) => {
          if (object !== this.emit)
            this.emit(this.emit, count, object, ...emitArguments);
          return count;
        });
  }

  /**
   * Returns distinct event listener count for given object or optionally count
   * for given event listener count on object.
   * @param {Object} object Object to query the count for.
   * @param {Object=} eventListener Optional event listener to get count from.
   * @return {number} Count.
   */
  count(object, eventListener) {
    const eventListeners = this._getEventListeners(object, false);
    if (!eventListeners) return 0;
    if (eventListener) {
      const eventListenerEntry = eventListeners.get(eventListener);
      return eventListenerEntry ? eventListenerEntry.count : 0;
    }
    let count = 0;
    for (eventListener of eventListeners.values()) count += eventListener.count;
    return count;
  }
}
/* Platform specific blocks, ignore in coverage */
/* istanbul ignore next */
const globalObject = global || window;
/* istanbul ignore next */
if (!globalObject) throw new Error("Could not global object.");
const weakMap = globalObject._weventWeakMap ||
  (globalObject._weventWeakMap = new WeakMap());
const globalWevent = new Wevent(weakMap);
globalWevent.Wevent = Wevent;

module.exports = globalWevent;