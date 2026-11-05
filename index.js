require('dotenv').config();

const {
  Client,
  Events,
  GatewayIntentBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');
const { parseGameDate } = require('./date-utils');

const COMMAND_NAME = 'join';
const MODAL_ID = 'join-declaration-modal';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`ログインしました: ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand() && interaction.commandName === COMMAND_NAME) {
    const modal = new ModalBuilder()
      .setCustomId(MODAL_ID)
      .setTitle('参戦表明');

    const dateInput = new TextInputBuilder()
      .setCustomId('game-date')
      .setLabel('日付（YYYY/MM/DD）')
      .setPlaceholder('2026/11/07')
      .setStyle(TextInputStyle.Short)
      .setMaxLength(10)
      .setRequired(true);
    const fieldInput = new TextInputBuilder()
      .setCustomId('game-field')
      .setLabel('フィールド名')
      .setPlaceholder('BLKFOX 1部')
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setRequired(true);
    const commentInput = new TextInputBuilder()
      .setCustomId('comment')
      .setLabel('コメント（任意）')
      .setPlaceholder('初参加です！')
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(1000)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(dateInput),
      new ActionRowBuilder().addComponents(fieldInput),
      new ActionRowBuilder().addComponents(commentInput),
    );
    await interaction.showModal(modal);
    return;
  }

  if (!interaction.isModalSubmit() || interaction.customId !== MODAL_ID) {
    return;
  }

  let gameDate;
  try {
    gameDate = parseGameDate(interaction.fields.getTextInputValue('game-date').trim());
  } catch (error) {
    await interaction.reply({
      content: error.message,
      ephemeral: true,
    });
    return;
  }

  const field = interaction.fields.getTextInputValue('game-field').trim();
  const comment = interaction.fields.getTextInputValue('comment').trim();
  if (!field) {
    await interaction.reply({ content: 'フィールド名を入力してください。', ephemeral: true });
    return;
  }

  const channel = interaction.channel;
  if (!channel || !channel.isTextBased() || typeof channel.send !== 'function') {
    await interaction.reply({
      content: 'このチャンネルには投稿できません。テキストチャンネルでお試しください。',
      ephemeral: true,
    });
    return;
  }

  await interaction.deferReply({ ephemeral: true });
  const lines = [
    '📅 参戦表明',
    '',
    `<@${interaction.user.id}>`,
    '',
    `**${gameDate.label}${field} に参加します！**`,
  ];
  if (comment) {
    lines.push('', comment);
  }

  try {
    await channel.send({
      content: lines.join('\n'),
      allowedMentions: {
        users: [interaction.user.id],
        roles: [],
        parse: [],
        repliedUser: false,
      },
    });
    await interaction.editReply('参戦表明を投稿しました。');
  } catch (error) {
    console.error('参戦表明の投稿に失敗しました:', error);
    await interaction.editReply('投稿に失敗しました。Botにチャンネルへの投稿権限があるか確認してください。');
  }
});

if (!process.env.DISCORD_TOKEN) {
  console.error('DISCORD_TOKEN が設定されていません。.env を確認してください。');
  process.exitCode = 1;
} else {
  client.login(process.env.DISCORD_TOKEN).catch((error) => {
    console.error('Discordへのログインに失敗しました:', error);
    process.exitCode = 1;
  });
}
