import { isDeepEqual } from "./utils";

describe("isDeepEqual", () => {
  it("should return true for deeply equal objects", () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 2 } };
    expect(isDeepEqual(obj1, obj2)).toBe(true);
  });

  it("should return false for objects with different values", () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 3 } };
    expect(isDeepEqual(obj1, obj2)).toBe(false);
  });

  it("should return false for objects with different keys", () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { d: 2 } };
    expect(isDeepEqual(obj1, obj2)).toBe(false);
  });

  it("should return true for deeply equal arrays", () => {
    const arr1 = [1, [2, 3]];
    const arr2 = [1, [2, 3]];
    expect(isDeepEqual(arr1, arr2)).toBe(true);
  });

  it("should return false for arrays with different values", () => {
    const arr1 = [1, [2, 3]];
    const arr2 = [1, [2, 4]];
    expect(isDeepEqual(arr1, arr2)).toBe(false);
  });
});
