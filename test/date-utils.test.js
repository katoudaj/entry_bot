const test = require('node:test');
const assert = require('node:assert/strict');
const { parseGameDate } = require('../date-utils');

test('valid date returns display label and Japanese weekday', () => {
  assert.deepEqual(parseGameDate('2026/11/07'), {
    year: 2026,
    month: 11,
    day: 7,
    weekday: '土',
    label: '11/7（土）',
  });
});

test('leap day is accepted only in leap years', () => {
  assert.equal(parseGameDate('2024/02/29').label, '2/29（木）');
  assert.throws(() => parseGameDate('2025/02/29'), /存在する日付/);
});

test('invalid format and impossible dates are rejected', () => {
  assert.throws(() => parseGameDate('2026-11-07'), /YYYY\/MM\/DD/);
  assert.throws(() => parseGameDate('2026/13/01'), /存在する日付/);
  assert.throws(() => parseGameDate('2026/04/31'), /存在する日付/);
});
