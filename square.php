<?php
/* ============================================================
 * Square API 公開プロキシ (フロントエンド用)
 *
 * - includes/ 直下の square_api.php は .htaccess で deny されているため、
 *   フロントエンドからは本ファイル経由で呼び出します。
 * - 公開エンドポイントは「在庫数取得」のみ（鍵はサーバ側）
 * - 管理者専用エンドポイント（locations / catalog / config）も
 *   セッション認証されている場合のみ通します。
 *
 * 使い方:
 *   GET  square.php?proxy=inventory&dataset=cafe_menu
 *   GET  square.php?proxy=inventory&dataset=goods
 *   GET  square.php?proxy=locations          (要管理者ログイン)
 *   GET  square.php?proxy=catalog&location_id=XXXX (要管理者ログイン)
 *   GET  square.php?proxy=config             (要管理者ログイン)
 * ============================================================ */

// includes/square_api.php を読み込んで、その先頭で定義されている関数群を再利用
require_once __DIR__ . '/includes/square_api.php';

// square_api.php は SCRIPT_FILENAME 判定で proxy モードに入るが、
// 本ファイル経由の場合は SCRIPT_FILENAME が square.php になるため、
// ここで明示的にプロキシ処理を行う。

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

$proxy = $_GET['proxy'] ?? '';

// ---- 公開エンドポイント ----
if ($proxy === 'inventory') {
    $key = $_GET['dataset'] ?? '';
    echo json_encode(square_public_inventory_for_dataset($key), JSON_UNESCAPED_UNICODE);
    exit;
}

// ---- 管理者専用 ----
session_start();
if (empty($_SESSION['admin_auth'])) {
    http_response_code(401);
    echo json_encode(['error' => 'unauthorized']);
    exit;
}

if ($proxy === 'locations') {
    echo json_encode(square_list_locations(), JSON_UNESCAPED_UNICODE);
    exit;
}
if ($proxy === 'catalog') {
    $locId = $_GET['location_id'] ?? '';
    if ($locId === '') { echo json_encode(['error' => 'location_id required', 'items' => []]); exit; }
    echo json_encode(square_list_catalog_with_inventory($locId), JSON_UNESCAPED_UNICODE);
    exit;
}
if ($proxy === 'config') {
    $cfg = square_load_config();
    $masked = $cfg;
    if ($masked['access_token']) {
        $t = $masked['access_token'];
        $masked['access_token_masked'] = strlen($t) > 8 ? substr($t, 0, 4) . '••••' . substr($t, -4) : '••••';
        $masked['access_token_set']    = true;
    } else {
        $masked['access_token_masked'] = '';
        $masked['access_token_set']    = false;
    }
    unset($masked['access_token']);
    echo json_encode($masked, JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'unknown proxy']);
