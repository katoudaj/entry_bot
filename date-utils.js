/**
 * 日付入力をそのまま投稿用の表示文字列として返す。
 * @param {string} input
 * @returns {{ label: string }}
 */
function parseGameDate(input) {
  return { label: input };
}

module.exports = { parseGameDate };
