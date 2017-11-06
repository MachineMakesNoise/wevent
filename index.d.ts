type EventListenerFunction = (...emitArguments: any[]) => any;
type BoundOffFunction = () => boolean;
type OnFunction = (object: {}, eventListener: EventListenerFunction) => BoundOffFunction;
type OffFunction = (object: {}, eventListener?: EventListenerFunction) => boolean;
type EmitFunction = (object: {}, ...emitArguments: any[]) => Promise<number>;
type CountFunction = (object: {}, eventListener?: EventListenerFunction) => number;

declare class Wevent {
    constructor(weakMap?:WeakMap<any, any>);
    on: OnFunction;
    off: OffFunction;
    emit: EmitFunction;
    count: CountFunction;
}

export default Wevent;
