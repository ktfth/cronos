'use strict';
const cronos = require('./');

// jest.useFakeTimers();

// test('waits interval finish', () => {
//   const cronos = require('./');
//
//   cronos.start('0:00:5');
//
//   expect(setInterval).toHaveBeenCalledTimes(5);
// });

test('give a specific time for second', () => {
  expect(cronos.give('second')).toBe(1000);
});

test('give a specific time for minute', () => {
  expect(cronos.give('minute')).toBe(1000 * 60);
});

test('give a specific time for hour', () => {
  expect(cronos.give('hour')).toBe((1000 * 60) * 60);
});
