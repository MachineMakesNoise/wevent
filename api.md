## Functions
<dl>
<dt><a href="#on">on(object, eventListener)</a> ⇒ <code>function</code></dt>
<dd><p>Bind event listener to object.</p>
</dd>
<dt><a href="#off">off(object, [eventListener])</a> ⇒ <code>undefined</code></dt>
<dd><p>Unbind event listener on object.</p>
</dd>
<dt><a href="#emit">emit(object, ...emitArguments)</a> ⇒ <code>Promise</code></dt>
<dd><p>Emit an event on object.</p>
</dd>
<dt><a href="#getEventListenerCount">getEventListenerCount(object, [eventListener])</a> ⇒ <code>number</code></dt>
<dd><p>Returns distinct event listener count for given object or optionally count
for given event listener count on object.</p>
</dd>
</dl>
<a name="on"></a>
## on(object, eventListener) ⇒ <code>function</code>
Bind event listener to object.

**Kind**: global function  
**Returns**: <code>function</code> - Off function tied directly to recently boundevent listener.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Object to bind the event listener to. |
| eventListener | <code>function</code> | Event listener to bind. |

<a name="off"></a>
## off(object, [eventListener]) ⇒ <code>undefined</code>
Unbind event listener on object.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Object to unbind event listener from. |
| [eventListener] | <code>function</code> | Event listener to unbind, if none given unbinds all event listeners on the given object. |

<a name="emit"></a>
## emit(object, ...emitArguments) ⇒ <code>Promise</code>
Emit an event on object.

**Kind**: global function  
**Returns**: <code>Promise</code> - Promise when emit has finished on all event listeners.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Object to emit to. |
| ...emitArguments | <code>\*</code> | Arguments to pass to event listeners. |

<a name="getEventListenerCount"></a>
## getEventListenerCount(object, [eventListener]) ⇒ <code>number</code>
Returns distinct event listener count for given object or optionally countfor given event listener count on object.

**Kind**: global function  
**Returns**: <code>number</code> - Count.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Object to query the count for. |
| [eventListener] | <code>Object</code> | Optional event listener to get count from. |

