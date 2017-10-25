declare module "Wevent" {

    declare function EventListenerFunction(...emitArguments: any): any;
    declare function BoundOffFunction(): boolean;

    declare class Wevent {
        constructor(weakMap?:WeakMap);
        on(object: {}, eventListener: EventListenerFunction): BoundOffFunction;
        off(object: {}, eventListener?: EventListenerFunction): boolean;
        emit(object: {}, ...emitArguments: any): Promise<number>;
        count(object: {}, eventListener?: EventListenerFunction): number;
        static on(object: {}, eventListener: EventListenerFunction): BoundOffFunction;
        static off(object: {}, eventListener?: EventListenerFunction): BoundOffFunction;
        static emit(object: {}, ...emitArguments: any): Promise<number>;
        static count(object: {}, eventListener?: EventListenerFunction): number;
    }

    export = Wevent;
}