const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

/**
 * YYYY/MM/DD の日付を検証し、タイムゾーンに依存しない曜日と表示文字列を返す。
 * @param {string} input
 * @returns {{ year: number, month: number, day: number, weekday: string, label: string }}
 */
function parseGameDate(input) {
  const match = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(input);
  if (!match) {
    throw new Error('日付は YYYY/MM/DD 形式で入力してください。');
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error('存在する日付を入力してください。');
  }

  // Date.UTC は 0〜99 年を 1900 年代として扱うため、setUTCFullYear を利用する。
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error('存在する日付を入力してください。');
  }

  const weekday = WEEKDAYS[date.getUTCDay()];
  return {
    year,
    month,
    day,
    weekday,
    label: `${month}/${day}（${weekday}）`,
  };
}

module.exports = { parseGameDate };
