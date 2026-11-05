# ソロ参戦組 Discord Bot

サバゲーの参戦表明を、Discordの `/参戦表明` コマンドから投稿するBotです。投稿先はコマンドを実行したテキストチャンネルです。

## 必要なもの

- Node.js 20 以上（npm を含む）
- Discordサーバーの管理権限
- Discord Developer Portalで作成したBot

## Discord Developer Portal の設定

1. [Discord Developer Portal](https://discord.com/developers/applications) で **New Application** を選び、アプリケーションを作成します。
2. **Bot** ページでBotを作成し、表示されるトークンを控えます。トークンはパスワードと同様に扱い、他人に共有しないでください。
3. **General Information** ページから **Application ID** を控えます。
4. **OAuth2 > URL Generator** で `bot` と `applications.commands` を選び、Bot Permissions は **Send Messages** を選択します。生成されたURLからBotをサーバーに招待します。
5. BotにMessage Content Intentなどの特権Intentを有効にする必要はありません。

## インストールと環境変数

プロジェクトのルートで依存パッケージをインストールし、サンプル環境変数ファイルをコピーします。

```powershell
npm.cmd install
Copy-Item .env.example .env
```

`.env` を開き、次の値を設定してください。

| 変数 | 値 |
| --- | --- |
| `DISCORD_TOKEN` | Developer PortalのBotページで取得したBotトークン |
| `CLIENT_ID` | General InformationにあるApplication ID |
| `GUILD_ID` | 開発用サーバーID（省略可。空欄なら全サーバーに登録） |

サーバーIDはDiscordの **ユーザー設定 > 詳細設定 > 開発者モード** を有効にし、サーバー名を右クリックして **サーバーIDをコピー** で取得できます。`.env` はGit管理対象外です。`.env` やBotトークンをGitHubへコミットしないでください。

## スラッシュコマンドの登録

```powershell
npm.cmd run deploy:commands
```

`GUILD_ID` が設定されている場合はそのサーバーだけに登録され、通常すぐ反映されます。空欄の場合はグローバルコマンドとして登録され、反映に時間がかかることがあります。コマンドを変更した場合も、この登録処理を再実行してください。

## Botの起動

```powershell
npm.cmd start
```

起動ログにログイン成功が表示されたら、登録先サーバーのテキストチャンネルで `/参戦表明` を実行します。日付（`YYYY/MM/DD`）とフィールド名は必須、コメントは任意です。実在しない日付や形式違いはエラーになり、曜日はUTC基準で自動計算します。

Botは起動中に限りコマンドへ応答します。常時利用する場合は、Botを継続稼働できる環境で起動してください。

## テスト

```powershell
npm.cmd test
```

日付の形式・実在性・曜日計算をNode.js標準のテストランナーで確認します。
