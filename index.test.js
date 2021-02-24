'use strict';

jest.useFakeTimers();

test('waits interval finish', () => {
  const cronos = require('./');

  cronos.start('0:00:5');

  expect(setInterval).toHaveBeenCalledTimes(5);
});
