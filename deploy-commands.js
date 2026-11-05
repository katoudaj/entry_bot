require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error('DISCORD_TOKEN と CLIENT_ID を .env に設定してください。');
  process.exit(1);
}

const command = new SlashCommandBuilder()
  .setName('join')
  .setNameLocalizations({ ja: '参戦表明' })
  .setDescription('サバゲーの参戦表明を投稿します')
  .setDescriptionLocalizations({ ja: 'サバゲーの参戦表明を投稿します' })
  .setDMPermission(false);

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
const route = GUILD_ID
  ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
  : Routes.applicationCommands(CLIENT_ID);

rest.put(route, { body: [command.toJSON()] })
  .then(() => {
    const scope = GUILD_ID ? `サーバー ${GUILD_ID}` : '全サーバー';
    console.log(`/参戦表明 コマンドを ${scope} に登録しました。`);
  })
  .catch((error) => {
    console.error('スラッシュコマンドの登録に失敗しました:', error);
    process.exitCode = 1;
  });
