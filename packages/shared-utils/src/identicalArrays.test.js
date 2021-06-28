const { identicalArrays } = require("./identicalArrays");

test('identicalArrays test success', () => {
  const arr1 = [
    "foo",
    "bar",
  ];
  const arr2 = [
    "foo",
    "bar",
  ];
  expect(identicalArrays(arr1, arr2)).toBeTruthy();
});

test('identicalArrays test failure', () => {
  const arr1 = [
    "aaa",
    "bbb",
  ];
  const arr2 = [
    "ccc",
    "ddd",
  ];
  expect(identicalArrays(arr1, arr2)).toBeFalsy();
});

test('identicalArrays test different lengths', () => {
  const arr1 = [
    "foo",
    "bar",
    "baz",
  ];
  const arr2 = [
    "foo",
    "bar",
  ];
  expect(identicalArrays(arr1, arr2)).toBeFalsy();
});
