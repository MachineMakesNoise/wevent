<a name="Wevent"></a>
## Wevent
**Kind**: global class  

* [Wevent](#Wevent)
  * [new Wevent([weakMap])](#new_Wevent_new)
  * [.on(object, eventListener)](#Wevent+on) ⇒ <code>function</code>
  * [.off(object, [eventListener])](#Wevent+off) ⇒ <code>undefined</code>
  * [.emit(object, ...emitArguments)](#Wevent+emit) ⇒ <code>Promise</code>
  * [.count(object, [eventListener])](#Wevent+count) ⇒ <code>number</code>

<a name="new_Wevent_new"></a>
### new Wevent([weakMap])
Construct Wevent object


| Param | Type | Description |
| --- | --- | --- |
| [weakMap] | <code>WeakMap</code> | WeakMap to use as storage, mainly used for global object. |

<a name="Wevent+on"></a>
### wevent.on(object, eventListener) ⇒ <code>function</code>
Bind event listener to object.

**Kind**: instance method of <code>[Wevent](#Wevent)</code>  
**Returns**: <code>function</code> - Off function tied directly to recently boundevent listener.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Object to bind the event listener to. |
| eventListener | <code>function</code> | Event listener to bind. |

<a name="Wevent+off"></a>
### wevent.off(object, [eventListener]) ⇒ <code>undefined</code>
Unbind event listener on object.

**Kind**: instance method of <code>[Wevent](#Wevent)</code>  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Object to unbind event listener from. |
| [eventListener] | <code>function</code> | Event listener to unbind, if none given unbinds all event listeners on the given object. |

<a name="Wevent+emit"></a>
### wevent.emit(object, ...emitArguments) ⇒ <code>Promise</code>
Emit an event on object.

**Kind**: instance method of <code>[Wevent](#Wevent)</code>  
**Returns**: <code>Promise</code> - Promise when emit has finished on all event listeners.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Object to emit to. |
| ...emitArguments | <code>\*</code> | Arguments to pass to event listeners. |

<a name="Wevent+count"></a>
### wevent.count(object, [eventListener]) ⇒ <code>number</code>
Returns distinct event listener count for given object or optionally countfor given event listener count on object.

**Kind**: instance method of <code>[Wevent](#Wevent)</code>  
**Returns**: <code>number</code> - Count.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Object to query the count for. |
| [eventListener] | <code>Object</code> | Optional event listener to get count from. |

