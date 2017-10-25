"use strict";

const expect = require("chai").expect;
const Wevent = require("../index");

const wevent = new Wevent();

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
          if (arg !== obj) {
            return;
          }
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
    it("should remove event listener by argument", () => {
      const obj = {};
      let emitted = false;
      const eventListener = () => emitted = true;
      on(obj, eventListener);
      off(obj, eventListener);
      return emit(obj).then(() => expect(emitted).to.equal(false));
    });
    it("should remove event listener by given off function", () => {
      const obj = {};
      let emitted = false;
      const eventListener = () => emitted = true;
      const offFunction = on(obj, eventListener);
      offFunction();
      return emit(obj).then(() => expect(emitted).to.equal(false));
    });
    it("should remove event listener by removing all from object", () => {
      const obj = {};
      let emitted = false;
      const eventListener = () => emitted = true;
      on(obj, eventListener);
      off(obj);
      return emit(obj).then(() => expect(emitted).to.equal(false));
    });
    it("should succeed removing event that doesn't exist", () => {
      off({}, () => null);
    });
    it("should listen to off", (done) => {
      const instance = new Wevent();
      const obj = { "test" : 1234 };
      let offFunction = null;
      const eventListener = (_, arg) => {
        if (arg !== obj) {
          return;
        }
        expect(obj).to.equal(arg);
        offFunction();
        expect(instance.count(instance.emit)).to.equal(0);
        done();
      };
      offFunction = instance.on(instance.off, eventListener);
      const offFunctionInstance = instance.on(obj, () => null);
      expect(instance.count(instance.off)).to.equal(1);
      offFunctionInstance();
      expect(instance.count(instance.off)).to.equal(0);
    });
  });
  describe("emit", () => {
    it("should emit to no listener", () => {
      return emit({});
    });
    it("should emit to one listener", () => {
      const obj = {};
      let emitted = false;
      const eventListener = () => emitted = true;
      on(obj, eventListener);
      return emit(obj).then(() => expect(emitted).to.equal(true));
    });
    it("should emit to one listener that fails", () => {
      const obj = {};
      const eventListener = () => {
        throw new Error("test");
      };
      on(obj, eventListener);
      emit(obj).
        then(() => fail()).
        catch((err) => expect(err.message).to.equal("test")).
        then(() => emit(obj)).
        catch((err) => expect(err.message).to.equal("test"));
    });
    it("should emit to one listener only once", () => {
      const obj = {};
      let emitted = 0;
      const eventListener = () => {
        emitted++;
        return off;
      };
      on(obj, eventListener);
      return emit(obj).
        then(() => emit(obj)).
        then(() => expect(emitted).to.equal(1));
    });
    it("should emit to one listener twice", () => {
      const obj = {};
      let emitted = 0;
      const eventListener = () => emitted++;
      on(obj, eventListener);
      return emit(obj).
        then(() => emit(obj)).
        then(() => expect(emitted).to.equal(2));
    });
    it("should emit to one listener and wait promise", () => {
      const obj = {};
      let emitted = 0;
      const eventListener = () => {
        return new Promise((resolve) => {
          emitted++;
          resolve();
        });
      };
      on(obj, eventListener);
      return emit(obj).then(() => emit(obj)).then((count) => {
        expect(count).to.be.equal(1);
        expect(emitted).to.equal(2);
      });
    });
    it("should emit to one listener and wait promise that emits", () => {
      const obj = {};
      let emitted = 0;
      const eventListener = () => new Promise((resolve) => {
        emitted++;
        if (emitted < 2) {
          return resolve(emit);
        } 
        else {
          resolve();
        }
      });
      on(obj, eventListener);
      return emit(obj).then((count) => {
        expect(count).to.be.equal(2);
        expect(emitted).to.equal(2);
      });
    });
    it("should emit to one listener and wait promise that emits and fails", 
      () => {
        const obj = {};
        let emitted = 0;
        const eventListener = () => {
          return new Promise((resolve) => {
            emitted++;
            if (emitted < 2) {
              return resolve(emit);
            } 
            else {
              throw new Error("test");
            }
          });
        };
        on(obj, eventListener);
        return emit(obj).
          then(() => fail()).
          catch((err) => expect(err.message).to.equal("test")).
          then(() => emit(obj)).then(() => fail()).
          catch((err) => expect(err.message).to.equal("test"));
      });
    it("should emit to one listener twice via (=> emit)", () => {
      const obj = {};
      let emitted = 0;
      const eventListener = () => {
        emitted++;
        return emitted < 2 ? emit : null;
      };
      on(obj, eventListener);
      return emit(obj).then((count) => {
        expect(count).to.be.equal(2);
        expect(emitted).to.equal(2);
      });
    });
    it("should emit to two listeners", () => {
      const obj = {};
      let emitted = false;
      const eventListener1 = () => emitted = !emitted;
      const eventListener2 = () => emitted = !emitted;
      on(obj, eventListener1);
      on(obj, eventListener2);
      return emit(obj).then((count) => {
        expect(count).to.be.equal(2);
        expect(emitted).to.equal(false);
      });
    });
    it("should emit with multiple arguments", () => {
      const obj = {};
      const result = {};
      const eventListener = (name1, value1, name2, value2) => {
        result[name1] = value1;
        result[name2] = value2;
      };
      on(obj, eventListener);
      return emit(obj, "one", 1, "two", 2).then(() => {
        expect(result["one"]).to.equal(1);
        expect(result["two"]).to.equal(2);
      });
    });
    it("should listen to same instance function", () => {
      let result = 0;
      class Test {
        test() {
          return true;
        }
      }
      const instance = new Test();
      const otherInstance = new Test();
      on(instance.test, () => result++);
      return emit(instance.test).
        then(() => expect(result).to.equal(1)).
        then(() => emit(otherInstance.test)).
        then(() => expect(result).to.equal(2));
    });
    it("should listen to unique instance object", () => {
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
      return emit(instance.handle).
        then(() => expect(result).to.equal(1)).
        then(() => emit(otherInstance.handle)).
        then(() => expect(result).to.equal(1)).
        then(() => {
          on(otherInstance.handle, () => result++);
          return emit(otherInstance.handle);
        }).then(() => expect(result).to.equal(2));
    });
    it("should listen to unique instance object via bind", () => {
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
      return emit(instance.test).then(() => {
        expect(result).to.equal(1);
        return emit(otherInstance.test);
      }).then(() => {
        expect(result).to.equal(1);
        on(otherInstance.test, () => result++);
        return emit(otherInstance.test);
      }).then(() => expect(result).to.equal(2));
    });
    it("should listen to emit", () => {
      const instance = new Wevent();
      const obj = { };
      let offFunction = null;
      const eventListener = (_, arg) => {
        if (arg !== obj) {
          return;
        }
        expect(obj).to.equal(arg);
        offFunction();
        expect(instance.count(instance.emit)).to.equal(0);
      };
      offFunction = instance.on(instance.emit, eventListener);
      expect(instance.count(instance.emit)).to.equal(1);
      return instance.emit(obj);
    });
  });
  describe("count", () => {
    it("count should reflect attached count", () => {
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
    });
  });
  describe("isolated", () => {
    it("should create isolated Wevent instance and not leak emit", () => {
      const obj = {};
      const instance = new Wevent();
      let emitted = 0;
      const eventListener = () => emitted++;
      instance.on(obj, eventListener);
      return emit(obj).
        then(() => instance.emit(obj)).
        then(() => expect(emitted).to.equal(1));
    });
    it("should create isolated Wevent instance and not leak on", () => {
      const obj = {};
      const instance = new Wevent();
      let emitted = 0;
      const eventListener = () => emitted++;
      on(obj, eventListener);
      instance.on(obj, eventListener);
      instance.emit(obj).then(() => expect(emitted).to.equal(1));
    });
  });
});