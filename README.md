# 第78回水戸一高・附属中学校学苑祭「天翔る」

第78回水戸一高・附属中学校学苑祭の公式サイトのソースコードです。

## 目次
- [プロジェクト構成](#プロジェクト構成)
- [ファイルパスの仕組み](#ファイルパスの仕組み)
- [実行方法](#実行方法)
- [管理パネル](#管理パネル)
- [デプロイ](#デプロイ)
- [技術スタック](#技術スタック)
- [使用しているWebフォント](#使用しているwebフォント)
- [主な機能](#主な機能)
- [今後の開発指針](#今後の開発指針)
- [開発ルール](#開発ルール)

## プロジェクト構成

```
.
├── index.php                          # トップページ
├── admin.php                          # 管理パネル（JSONデータ編集・天候切替）
├── sw.js                              # Service Worker（PWA対応）
├── pages/                             # 各ページ
│   ├── concept.php                    # コンセプトビューページ「AMAGAKERU」
│   ├── kikaku.php                     # 企画紹介ページ
│   ├── cashless.php                   # キャッシュレス決済ページ
│   ├── leaflet.php                    # デジタルリーフレット
│   ├── timetable.php                  # ステージタイムテーブル
│   ├── cafe.php                       # 喫茶メニュー
│   ├── goods.php                      # グッズ・お土産
│   ├── setlist.php                    # Mプロ・Aステセットリスト
│   ├── greetings.php                  # 代表者挨拶
│   ├── comingsoon.php                 # Coming Soonページ
│   ├── sitemap.php                    # サイトマップページ
│   ├── access.php                     # アクセスページ
│   ├── contact.php                    # お問い合わせページ
│   ├── privacy.php                    # プライバシーポリシーページ
│   ├── pack-reservation.php           # 学苑祭応援パック購入予約フォーム
│   └── errors/                        # エラーページ群
├── includes/                          # 共通パーツ
│   ├── header.php                     # 共通ヘッダー
│   └── footer.php                     # 共通フッター
├── assets/                            # 静的アセット
│   ├── css/                           # 各ページ用CSS
│   ├── data/                          # 企画・メニュー等のJSONデータ
│   └── js/                            # 各ページ用JavaScript
├── materials/                         # 画像・動画素材
│   ├── NowLoading/                    # ローディング素材
│   ├── kikakuimg/                     # 企画紹介用画像
│   └── favicon/                       # ファビコン群
├── .github/
│   └── workflows/
│       └── deploy.yml                 # 自動デプロイ設定（GitHub Actions）
├── sitemap.xml                        # XMLサイトマップ
├── robots.txt                         # robots.txt
└── README.md
```

## ファイルパスの仕組み

共通パーツ（`includes/header.php`, `includes/footer.php`）は各ページからインクルードされます。ページの階層に応じて `$base_path` 変数を設定し、相対パスを自動で切り替えます。

- **ルート階層**（`index.php`）: `$base_path = '.'`
- **pages/ 階層**: `$base_path = '..'`
- **pages/errors/ 階層**: `$base_path = '../..'`

新しいページを追加する場合は、`<?php $base_path = '..'; ?>` を `<body>` 直後に記述してからヘッダー・フッターをインクルードしてください。

## 実行方法

PHPがインストールされている環境であれば、以下のコマンドでローカルサーバーを起動して閲覧できます。

```bash
php -S localhost:8000
```

その後、ブラウザで `http://localhost:8000` にアクセスしてください。

## 管理パネル

`admin.php` は、サイト上の動的なデータを直接編集するための管理者用インターフェースです。

- **JSON編集**: `assets/data/` 内の企画情報、喫茶メニュー、グッズ、タイムテーブル、リーフレットのピン情報をブラウザ上で編集・保存できます。
- **天候モード切替**: `pages/timetable.php` 内の `STAGE_WEATHER_MODE` を書き換え、サイト全体のタイムテーブルを「晴天時」「雨天時」に即座に切り替えることができます。
- **アクセス制限**: 簡易的なパスワード認証が設定されています。

## デプロイ

本プロジェクトは GitHub Actions を利用した自動デプロイに対応しています。

- **デプロイ先**: `https://gakuensai.net`
- **トリガー**: `main` ブランチへのプッシュ
- **仕組み**: `SamKirkland/FTP-Deploy-Action` を使用し、FTP経由で本番サーバーの `public_html` ディレクトリと同期します。

## 技術スタック

- **PHP**: 共通パーツのインクルード、`$base_path` による相対パス制御
- **CSS3**: カスタムプロパティ、backdrop-filter、CSS Grid/Flexbox、dvh対応
- **JavaScript (Vanilla)**: 各種インタラクション、カウントダウン、WP連携、OpenSeadragon
- **PWA (Service Worker)**: オフラインアクセス対応、アセットキャッシュ
- **WordPress REST API**: お知らせ・ブログ記事の動的取得
- **GitHub Actions**: FTP自動デプロイ

## 使用しているWebフォント

| フォント名 | 用途 |
|---|---|
| Zen Old Mincho | タイトル、見出し、バッジ |
| Shippori Mincho | 本文テキスト、日程情報 |
| Noto Sans JP | ラベル、サブテキスト、補助情報 |

## 主な機能

- **レスポンシブ・ローディング画面**: 接続端末の性能や状態に応じたフォールバック機能付き
- **階層型ハンバーガーメニュー**: アクセシビリティ（WAI-ARIA）とキーボード操作に配慮した設計
- **デジタルリーフレット**: OpenSeadragonによる高解像度ズームと検索・ピン連動
- **ステージタイムテーブル**: 晴天/雨天の即時切替、現在時刻のリアルタイム表示
- **企画/メニュー検索**: JSONデータに基づいたリアルタイムフィルタリング機能
- **PWA対応**: 当日の通信環境が悪化しても、キャッシュされた企画情報やマップを閲覧可能

## Square API 連携

喫茶メニュー（`cafe_menu.json`）とグッズ・お土産（`goods.json`）は、Square API から在庫数を動的に取得して表示します。

### 設定方法

1. `admin.php` にログインし、サイドバーの「**Square連携 → API設定**」を開く
2. Application ID / Access Token / 環境（sandbox / production）を入力して保存
3. 「**利用可能な店舗を取得**」をクリックすると、その Application で使える店舗一覧が表示され、ワンクリックで Location ID を追加できる
4. 「**Square連携 → カタログDB**」で店舗を選択すると、Square 側に登録されている全商品 × 全バリエーション × 現在の在庫数が一覧表示される（Variation ID をコピー可）
5. 「**喫茶メニュー / グッズ・お土産**」の各商品編集ダイアログで、その商品に対応する **Location ID** と **Variation ID** をプルダウンと入力欄で設定する
   - 味などのバリエーションがある場合は、バリエーションごとに ID を設定可能
6. 設定後、`pages/cafe.php` / `pages/goods.php` を開くと、`square.php?proxy=inventory` 経由で在庫数が動的に反映される

### JSONスキーマのルール

```json
{
  "id": "C001", "title": "...", "price": 200,
  "locationId": "L6Z9B2DG9SCVD",
  "variationId": "ABCD1234EFGH5678"
}
```

バリエーションがある場合は各バリエーションに `locationId` / `variationId` を持たせます（`locationId` は省略時に親アイテムの値を継承）:

```json
{
  "id": "C004", "title": "かき氷",
  "locationId": "L6Z9B2DG9SCVD",
  "variations": [
    { "name": "いちご",       "price": 300, "locationId": "", "variationId": "VAR_STRAWBERRY" },
    { "name": "ブルーハワイ", "price": 300, "locationId": "", "variationId": "VAR_BLUEHAWAII" }
  ]
}
```

### セキュリティ

- Access Token / Application ID は `includes/square_config.local.php` に保存されます（`.gitignore` 対象）
- `includes/` 直下は `.htaccess` の `Require all denied` で直接アクセス不可
- フロント JS は **必ず** `square.php` プロキシ経由で API を呼び、鍵が露出しない設計
- 公開エンドポイントは「JSON に登録済みの Variation ID の在庫数」のみ、それ以外（カタログ一覧・店舗一覧）はセッション認証必須

## 今後の開発指針

1. **各ページの本実装**: 落とし物ページの実装
2. **パフォーマンス最適化**: 画像のWebP化の徹底、不要なアセットの削除
3. **アクセシビリティ改善**: 全コンテンツのスクリーンリーダー対応、キーボード操作の完全性向上

## 開発ルール

- **相対パスの徹底**: 常に `$base_path` を使用し、環境に依存しないパス指定を行う。
- **WebP優先**: 画像アセットは原則として WebP 形式を使用する。
- **CSS設計**: 変数（`assets/css/header.css` 等で定義）を活用し、ハードコーディングを避ける。
- **レスポンシブ対応**: モバイル (〜400px) / タブレット (768px〜1023px) / PC (1024px〜) の3段階を基準とする。
- **コメントの維持**: 既存のロジック説明や注意書きのコメントは、意図を理解した上で慎重に扱う。
- **自動デプロイの意識**: `main` ブランチへのマージは、即座に本番環境へ反映されることを念頭に置く。
