'use strict';
const cronos = require('../src');

jest.useFakeTimers();

test('give a specific time for second', () => {
  expect(cronos.give('second')).toBe(1000);
});

test('give a specific time for minute', () => {
  expect(cronos.give('minute')).toBe(1000 * 60);
});

test('give a specific time for hour', () => {
  expect(cronos.give('hour')).toBe((1000 * 60) * 60);
});

test('time lapse related to the display', () => {
  expect(cronos.timeLapse('0:01:05')).toBe((1000 * 60) + 5000);
});

test('treat time inputs', () => {
  expect(cronos.treatTime('0:1:05')).toBe('0:01:05');
});

test('waits interval finish', () => {
  let trigger = new cronos.Trigger('0:00:5');

  expect(setInterval).toHaveBeenCalledTimes(1);
});
