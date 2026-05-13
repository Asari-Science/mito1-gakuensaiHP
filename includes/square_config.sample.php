<?php
/* ============================================================
 * Square API Configuration (SAMPLE)
 *
 * 本番運用では、このファイルを `square_config.local.php` という
 * 名前でコピーし、実際の Application ID / Access Token を入力してください。
 * `square_config.local.php` は .gitignore でリポジトリから除外されます。
 *
 * admin.php の「Square連携」パネルから入力した値も
 * 自動的に square_config.local.php に書き込まれます。
 *
 * このファイル自体は直接ブラウザからアクセスされないよう
 * includes/.htaccess で deny されます。
 * ============================================================ */

return [
    // Square Application ID (Developer Dashboardのアプリ画面に表示されるID)
    'application_id' => '',

    // Square Access Token (PAT または OAuth Access Token)
    'access_token'   => '',

    // 環境: 'sandbox' または 'production'
    'environment'    => 'sandbox',

    // 利用する Location ID の一覧（複数店舗対応）
    // 例: ['L6Z9B2DG9SCVD', 'LXXXXXXXXXXXX']
    'location_ids'   => [],

    // Square-Version ヘッダ
    'square_version' => '2024-01-18',
];
