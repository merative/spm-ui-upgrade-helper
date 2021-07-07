const { identicalData } = require("./identicalData");

test('identicalData test arrays success', () => {
  const arr1 = [
    "foo",
    "bar",
  ];
  const arr2 = [
    "foo",
    "bar",
  ];
  expect(identicalData(arr1, arr2)).toBeTruthy();
});

test('identicalData test arrays failure', () => {
  const arr1 = [
    "aaa",
    "bbb",
  ];
  const arr2 = [
    "ccc",
    "ddd",
  ];
  expect(identicalData(arr1, arr2)).toBeFalsy();
});

test('identicalData test arrays different lengths', () => {
  const arr1 = [
    "foo",
    "bar",
    "baz",
  ];
  const arr2 = [
    "foo",
    "bar",
  ];
  expect(identicalData(arr1, arr2)).toBeFalsy();
});

test('identicalData test strings success', () => {
  const arr1 = "foo";
  const arr2 = "foo";
  expect(identicalData(arr1, arr2)).toBeTruthy();
});

test('identicalData test strings failure', () => {
  const arr1 = "foo";
  const arr2 = "bar";
  expect(identicalData(arr1, arr2)).toBeFalsy();
});

test('identicalData test strings different length', () => {
  const arr1 = "foo";
  const arr2 = "foobar";
  expect(identicalData(arr1, arr2)).toBeFalsy();
});
