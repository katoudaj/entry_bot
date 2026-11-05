const test = require('node:test');
const assert = require('node:assert/strict');
const { parseGameDate } = require('../date-utils');

test('date input is returned as-is without format validation or weekday', () => {
  for (const input of ['2026/11/07', '2026-11-07', '2026年11月7日', '自由入力']) {
    assert.deepEqual(parseGameDate(input), { label: input });
  }
});
