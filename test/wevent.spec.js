"use strict";

const expect = require("chai").expect;
const co = require("co");
const wevent = require("../index.js");
const Wevent = wevent.Wevent;

const on = wevent.on;
const off = wevent.off;
const emit = wevent.emit;
const count = wevent.count;

describe("wevent", () => {
  describe("on", () => {
    it("should add event listener", () => {
      const  obj = {};
      expect(() => on(obj, () => "added")).to.not.throw(Error);
    });
    it("should throw Error adding wrong type of event listener", () => {
      const  obj = {};
      expect(() => on(obj, 1234)).to.throw(Error);
    });
    it("should throw Error adding to wrong type of handle", () => {
      expect(() => on(1234, function() {})).to.throw(Error);
    });
    it("should listen to on",
      (done) => {
        const instance = new Wevent();
        const obj = { "test" : 1234 };
        const eventListener = (offFunction, arg) => {
          if (arg !== obj) return;
          expect(obj).to.equal(arg);
          offFunction();
          expect(instance.count(instance.emit)).to.equal(0);
          done();
        };
        instance.on(instance.on, eventListener);
        expect(instance.count(instance.on)).to.equal(1);
        instance.on(obj, () => null);
      }
    );
  });
  describe("off", () => {
    it("should remove event listener by argument", ()=> co(function*() {
      const obj = {};
      let emitted = false;
      const eventListener = () => emitted = true;
      on(obj, eventListener);
      off(obj, eventListener);
      yield emit(obj);
      expect(emitted).to.equal(false);
    }));
    it("should remove event listener by given off function", ()=>
      co(function*() {
        const obj = {};
        let emitted = false;
        const eventListener = () => emitted = true;
        const offFunction = on(obj, eventListener);
        offFunction();
        yield emit(obj);
        expect(emitted).to.equal(false);
      })
    );
    it("should remove event listener by removing all from object", ()=>
      co(function*() {
        const obj = {};
        let emitted = false;
        const eventListener = () => emitted = true;
        on(obj, eventListener);
        off(obj);
        yield emit(obj);
        expect(emitted).to.equal(false);
      })
    );
    it("should succeed removing event that doesn't exist", ()=> co(function*() {
      off({}, () => null);
    }));
    it("should listen to off",
      (done) => {
        const instance = new Wevent();
        const obj = { "test" : 1234 };
        let offFunction;
        const eventListener = (_, arg) => {
          if (arg !== obj) return;
          expect(obj).to.equal(arg);
          offFunction();
          expect(instance.count(instance.emit)).to.equal(0);
          done();
        };
        offFunction = instance.on(instance.off, eventListener);
        const offFunctionInstance = instance.on(obj, () => null);
        expect(instance.count(instance.off)).to.equal(1);
        offFunctionInstance();
      }
    );
  });
  describe("emit", () => {
    it("should emit to no listener", () => co(function*() {
      yield emit({});
    }));
    it("should emit to one listener", () => co(function*() {
      const obj = {};
      let emitted = false;
      const eventListener = () => emitted = true;
      on(obj, eventListener);
      yield emit(obj);
      expect(emitted).to.equal(true);
    }));
    it("should emit to one listener that fails", (done) => co(function*() {
      const obj = {};
      const eventListener = () => {
        throw new Error("test");
      };
      on(obj, eventListener);
      try {
        yield emit(obj);
        fail();
      }
      catch (err) {
        expect(err.message).to.equal("test");
      }
      emit(obj).catch((err) => {
        expect(err.message).to.equal("test");
        done();
      });
    }));
    it("should emit to one listener only once", ()=> co(function*() {
      const obj = {};
      let emitted = 0;
      const eventListener = () => {
        emitted++;
        return off;
      };
      on(obj, eventListener);
      yield emit(obj);
      yield emit(obj);
      expect(emitted).to.equal(1);
    }));
    it("should emit to one listener twice", () => co(function*() {
      const obj = {};
      let emitted = 0;
      const eventListener = () => emitted++;
      on(obj, eventListener);
      yield emit(obj);
      yield emit(obj);
      expect(emitted).to.equal(2);
    }));
    it("should emit to one listener and wait promise", (done) => co(
      function*() {
        const obj = {};
        let emitted = 0;
        const eventListener = () => {
          return new Promise((resolve) => {
            emitted++;
            done();
          });
        };
        on(obj, eventListener);
        const count = yield emit(obj);
        expect(count).to.be.equal(1);
        expect(emitted).to.equal(1);
      }
    ));
    it("should emit to one listener and wait promise that emits", (done) => co(
      function*() {
        const obj = {};
        let emitted = 0;
        const eventListener = () => {
          return new Promise((resolve) => {
            emitted++;
            if (emitted < 2) {
              return resolve(emit);
            }
            else {
              done();
              resolve();
            }
          });
        };
        on(obj, eventListener);
        const count = yield emit(obj);
        expect(count).to.be.equal(2);
        expect(emitted).to.equal(2);
      }
    ));
    it("should emit to one listener and wait promise that emits and fails",
      (done) => co(function*() {
        const obj = {};
        let emitted = 0;
        const eventListener = () => {
          return new Promise((resolve) => {
            emitted++;
            if (emitted < 2)
              return resolve(emit);
            else
              throw new Error("test");
          });
        };
        on(obj, eventListener);
        try {
          yield emit(obj);
          fail();
        }
        catch (err) {
          expect(err.message).to.equal("test");
        }
        emit(obj).catch((err) => {
          expect(err.message).to.equal("test");
          done();
        });
      }));
    it("should emit to one listener twice via (=>emit)", () => co(function*() {
      const obj = {};
      let emitted = 0;
      const eventListener = () => {
        emitted++;
        return emitted < 2 ? emit : null;
      };
      on(obj, eventListener);
      const count = yield emit(obj);
      expect(count).to.be.equal(2);
      expect(emitted).to.equal(2);
    }));
    it("should emit to two listeners", () => co(function*() {
      const obj = {};
      let emitted = false;
      const eventListener1 = () => emitted = !emitted;
      const eventListener2 = () => emitted = !emitted;
      on(obj, eventListener1);
      on(obj, eventListener2);
      yield emit(obj);
      expect(emitted).to.equal(false);
    }));
    it("should emit with multiple arguments", () => co(function*() {
      const obj = {};
      const result = {};
      const eventListener = (name1, value1, name2, value2) => {
        result[name1] = value1;
        result[name2] = value2;
      };
      on(obj, eventListener);
      yield emit(obj, "one", 1, "two", 2);
      expect(result["one"]).to.equal(1);
      expect(result["two"]).to.equal(2);
    }));
    it("should listen to same instance function", () => co(function*() {
      let result = 0;
      class Test {
        test() {
          return true;
        }
      }
      const instance = new Test();
      const otherInstance = new Test();
      on(instance.test, () => result++);
      yield emit(instance.test);
      expect(result).to.equal(1);
      yield emit(otherInstance.test);
      expect(result).to.equal(2);
    }));
    it("should listen to unique instance object", () => co(function*() {
      let result = 0;
      class Test {
        constructor() {
          this.handle = {};
        }
        test() {
          result++;
        }
      }
      const instance = new Test();
      const otherInstance = new Test();
      on(instance.handle, () => result++);
      yield emit(instance.handle);
      expect(result).to.equal(1);
      yield emit(otherInstance.handle);
      expect(result).to.equal(1);
      on(otherInstance.handle, () => result++);
      yield emit(otherInstance.handle);
      expect(result).to.equal(2);
    }));
    it("should listen to unique instance object via bind", () => co(function*(){
      let result = 0;
      class Test {
        constructor() {
          this.test = this.test.bind(this);
        }
        test() {
          result++;
        }
      }
      const instance = new Test();
      const otherInstance = new Test();
      on(instance.test, () => result++);
      yield emit(instance.test);
      expect(result).to.equal(1);
      yield emit(otherInstance.test);
      expect(result).to.equal(1);
      on(otherInstance.test, () => result++);
      yield emit(otherInstance.test);
      expect(result).to.equal(2);
    }));
    it("should listen to emit",
      (done) => {
        const instance = new Wevent();
        const obj = { };
        let offFunction;
        const eventListener = (_, arg) => {
          if (arg !== obj) return;
          expect(obj).to.equal(arg);
          offFunction();
          expect(instance.count(instance.emit)).to.equal(0);
          done();
        };
        offFunction = instance.on(instance.emit, eventListener);
        expect(instance.count(instance.emit)).to.equal(1);
        instance.emit(obj);
      }
    );
  });
  describe("count", () => {
    it("count should reflect attached count", () => co(
      function*() {
        const obj = {};
        const eventListener1 = () => null;
        const eventListener2 = () => null;
        expect(count(obj)).to.equal(0);
        expect(count(obj, eventListener1)).to.equal(0);
        expect(count(obj, eventListener1)).to.equal(0);
        on(obj, eventListener1);
        on(obj, eventListener2);
        on(obj, eventListener2);
        expect(count(obj)).to.equal(3);
        expect(count(obj, eventListener1)).to.equal(1);
        expect(count(obj, eventListener2)).to.equal(2);
        off(obj, eventListener2);
        expect(count(obj, eventListener2)).to.equal(1);
        off(obj, eventListener2);
        expect(count(obj, eventListener2)).to.equal(0);
        expect(count(obj)).to.equal(1);
        off(obj, eventListener1);
        expect(count(obj)).to.equal(0);
        expect(count(obj, eventListener1)).to.equal(0);
        expect(count(obj, eventListener2)).to.equal(0);
      }
    ));
  });
  describe("isolated", () => {
    it("should create isolated Wevent instance and not leak emit",
      () => co(function*() {
        const obj = {};
        const instance = new Wevent();
        let emitted = 0;
        const eventListener = () => emitted++;
        instance.on(obj, eventListener);
        yield emit(obj);
        yield instance.emit(obj);
        expect(emitted).to.equal(1);
      }
    ));
    it("should create isolated Wevent instance and not leak on",
      () => co(function*() {
        const obj = {};
        const instance = new Wevent();
        let emitted = 0;
        const eventListener = () => emitted++;
        on(obj, eventListener);
        instance.on(obj, eventListener);
        yield instance.emit(obj);
        expect(emitted).to.equal(1);
      }
    ));
  });
});