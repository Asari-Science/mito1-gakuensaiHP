<?php
session_start();

/* ============================================================
 * Admin Panel — Visual Editor
 * - Login protected
 * - Form/table-based editing for each data type
 *   (cafe_menu / goods / kikaku / leaflet_pois / stage_timetable)
 * - Stage timetable + leaflet_pois remain JSON-edited (complex schema)
 *   but with an integrated read-only preview table.
 * - Weather mode toggle
 * ============================================================ */

// --- Simple password authentication ---
$ADMIN_PASS_HASH  = '$2y$10$8KjGkT3xV5nW5Ld0R3qZXOYmVv2Jf6kU1pN8sA7hQ4wE9rT0yB6Cm';
$ADMIN_PASS_PLAIN = 'gakuensai2026';

$DATA_DIR   = __DIR__ . '/assets/data/';
$DATA_FILES = [
    'cafe_menu'       => ['file' => 'cafe_menu.json',       'label' => '喫茶メニュー',       'icon' => '☕', 'type' => 'product', 'theme' => 'cafe'],
    'goods'           => ['file' => 'goods.json',           'label' => 'グッズ・お土産',     'icon' => '🎁', 'type' => 'product', 'theme' => 'goods'],
    'kikaku'          => ['file' => 'kikaku.json',          'label' => '企画情報',           'icon' => '🎪', 'type' => 'kikaku',  'theme' => 'kikaku'],
    'leaflet_pois'    => ['file' => 'leaflet_pois.json',    'label' => 'リーフレットPOI',   'icon' => '📍', 'type' => 'leaflet', 'theme' => 'leaflet'],
    'stage_timetable' => ['file' => 'stage_timetable.json', 'label' => 'タイムテーブル',     'icon' => '🕐', 'type' => 'json',    'theme' => 'timetable'],
];

// --- Login ---
$login_error = '';
if (isset($_POST['action']) && $_POST['action'] === 'login') {
    $pw = $_POST['password'] ?? '';
    if ($pw === $ADMIN_PASS_PLAIN || password_verify($pw, $ADMIN_PASS_HASH)) {
        $_SESSION['admin_auth'] = true;
        header('Location: admin.php');
        exit;
    }
    $login_error = 'パスワードが正しくありません。';
}

// --- Logout ---
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// --- API: read JSON (for client) ---
if (isset($_GET['api']) && $_GET['api'] === 'read' && !empty($_SESSION['admin_auth'])) {
    header('Content-Type: application/json; charset=utf-8');
    $key = $_GET['key'] ?? '';
    if (!isset($DATA_FILES[$key])) { http_response_code(400); echo json_encode(['error' => 'unknown key']); exit; }
    $path = $DATA_DIR . $DATA_FILES[$key]['file'];
    echo file_exists($path) ? file_get_contents($path) : '[]';
    exit;
}

// --- API: save (POST JSON body) ---
$save_message = '';
if (isset($_POST['action']) && $_POST['action'] === 'save' && !empty($_SESSION['admin_auth'])) {
    $key = $_POST['data_key'] ?? '';
    if (isset($DATA_FILES[$key])) {
        $json_str = $_POST['json_content'] ?? '';
        $decoded  = json_decode($json_str);
        if ($decoded === null && trim($json_str) !== 'null') {
            $save_message = 'error:JSONの形式が正しくありません: ' . json_last_error_msg();
        } else {
            $pretty   = json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $filepath = $DATA_DIR . $DATA_FILES[$key]['file'];
            if (file_put_contents($filepath, $pretty . "\n")) {
                $save_message = 'success:' . $DATA_FILES[$key]['label'] . 'を保存しました。';
            } else {
                $save_message = 'error:ファイルの書き込みに失敗しました。';
            }
        }
    }
}

// --- Weather mode save ---
if (isset($_POST['action']) && $_POST['action'] === 'save_weather' && !empty($_SESSION['admin_auth'])) {
    $mode = $_POST['weather_mode'] ?? 'sunny';
    if ($mode !== 'sunny' && $mode !== 'rainy') $mode = 'sunny';
    $tt_file = __DIR__ . '/pages/timetable.php';
    $content = file_get_contents($tt_file);
    $content = preg_replace(
        "/window\.STAGE_WEATHER_MODE\s*=\s*'[^']*'/",
        "window.STAGE_WEATHER_MODE = '$mode'",
        $content
    );
    file_put_contents($tt_file, $content);
    $save_message = 'success:天候モードを「' . ($mode === 'sunny' ? '晴天' : '雨天') . '」に変更しました。';
}

// --- Read current weather mode ---
$current_weather = 'sunny';
$tt_content = @file_get_contents(__DIR__ . '/pages/timetable.php');
if ($tt_content && preg_match("/window\.STAGE_WEATHER_MODE\s*=\s*'([^']*)'/", $tt_content, $m)) {
    $current_weather = $m[1];
}

$is_logged_in = !empty($_SESSION['admin_auth']);

// --- Pre-load data for client embedding (only when logged in) ---
$initial_data = [];
if ($is_logged_in) {
    foreach ($DATA_FILES as $key => $info) {
        $path = $DATA_DIR . $info['file'];
        $initial_data[$key] = file_exists($path) ? file_get_contents($path) : '[]';
    }
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>管理パネル | 第78回学苑祭</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./assets/css/admin.css">
  <link rel="shortcut icon" href="./materials/favicon/favicon.ico">
</head>
<body>

<?php if (!$is_logged_in): ?>
<!-- ==================== LOGIN ==================== -->
<div class="admin_login_wrap">
  <form class="admin_login_card" method="post" autocomplete="off">
    <input type="hidden" name="action" value="login">
    <div class="admin_login_logo">学苑祭 管理パネル</div>
    <p class="admin_login_sub">管理者用のページです。<br>パスワードを入力してください。</p>
    <?php if ($login_error): ?>
      <div class="admin_login_error"><?= htmlspecialchars($login_error) ?></div>
    <?php endif; ?>
    <div class="admin_input_group">
      <label for="password">パスワード</label>
      <input type="password" id="password" name="password" class="admin_input" required autofocus placeholder="パスワードを入力">
    </div>
    <button type="submit" class="admin_login_btn">ログイン</button>
  </form>
</div>

<?php else: ?>
<!-- ==================== DASHBOARD ==================== -->
<div class="admin_topbar">
  <span class="admin_topbar_title">
    <span class="admin_topbar_icon" aria-hidden="true">⛩</span>
    学苑祭 管理パネル
  </span>
  <span class="admin_topbar_spacer"></span>
  <span class="admin_topbar_user">管理者ログイン中</span>
  <button class="admin_topbar_menu_btn" id="admin_menu_btn" aria-label="メニューを開く" type="button">
    <span></span><span></span><span></span>
  </button>
  <a href="admin.php?logout=1" class="admin_topbar_logout">ログアウト</a>
</div>

<div class="admin_body">
  <!-- ===== Sidebar ===== -->
  <nav class="admin_sidebar" id="admin_sidebar" aria-label="管理セクション">
    <div class="admin_sidebar_title">データ管理</div>
    <?php $first = true; foreach ($DATA_FILES as $key => $info): ?>
      <button class="admin_sidebar_btn <?= $first ? 'active' : '' ?>"
              data-panel="panel_<?= $key ?>" type="button">
        <span class="sidebar_icon"><?= $info['icon'] ?></span>
        <span class="sidebar_lbl"><?= htmlspecialchars($info['label']) ?></span>
      </button>
    <?php $first = false; endforeach; ?>
    <div class="admin_sidebar_title" style="margin-top:18px;">サイト設定</div>
    <button class="admin_sidebar_btn" data-panel="panel_weather" type="button">
      <span class="sidebar_icon">🌤️</span>
      <span class="sidebar_lbl">天候モード</span>
    </button>
  </nav>

  <!-- ===== Content ===== -->
  <div class="admin_content">

    <!-- Hidden form used as universal save channel -->
    <form id="admin_save_form" method="post" style="display:none;">
      <input type="hidden" name="action" value="save">
      <input type="hidden" name="data_key" id="admin_save_key">
      <input type="hidden" name="json_content" id="admin_save_payload">
    </form>

    <?php $first = true; foreach ($DATA_FILES as $key => $info): ?>
    <section class="admin_panel <?= $first ? 'active' : '' ?>"
             id="panel_<?= $key ?>"
             data-key="<?= $key ?>"
             data-type="<?= $info['type'] ?>"
             data-theme="<?= $info['theme'] ?>">
      <header class="admin_panel_header">
        <div class="admin_panel_titlewrap">
          <span class="admin_panel_icon"><?= $info['icon'] ?></span>
          <div>
            <h1 class="admin_panel_title"><?= htmlspecialchars($info['label']) ?></h1>
            <p class="admin_panel_filename"><code><?= htmlspecialchars($info['file']) ?></code></p>
          </div>
        </div>
        <div class="admin_panel_actions">
          <span class="admin_dirty_badge" data-dirty-badge hidden>
            <span class="dirty_dot"></span>未保存の変更
          </span>
          <button type="button" class="admin_btn admin_btn_outline" data-action="reload">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>
            元に戻す
          </button>
          <button type="button" class="admin_btn admin_btn_success" data-action="save">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            保存
          </button>
        </div>
      </header>

      <?php if ($info['type'] === 'product'): ?>
        <!-- ============ PRODUCT (cafe_menu / goods) ============ -->
        <p class="admin_panel_desc">
          表の各行をクリックすると編集ダイアログが開きます。「+ 新規追加」で項目を追加、ドラッグで並び替えできます。
        </p>
        <div class="admin_toolbar">
          <div class="admin_search_wrap">
            <svg class="admin_search_icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="search" class="admin_toolbar_search" placeholder="商品名・カテゴリ・販売場所で検索..." data-table-search>
          </div>
          <button type="button" class="admin_btn admin_btn_primary" data-action="add">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            新規追加
          </button>
        </div>
        <div class="admin_card admin_card_table">
          <div class="admin_table_wrap">
            <table class="admin_table" data-table>
              <thead>
                <tr>
                  <th class="col_drag" aria-label="並び替え"></th>
                  <th class="col_id">ID</th>
                  <th class="col_photo">写真</th>
                  <th class="col_title">商品名</th>
                  <th class="col_cat">カテゴリ</th>
                  <th class="col_price">金額</th>
                  <th class="col_seller">販売場所</th>
                  <th class="col_pay">決済</th>
                  <th class="col_stock">在庫</th>
                  <th class="col_actions" aria-label="操作"></th>
                </tr>
              </thead>
              <tbody data-tbody></tbody>
            </table>
          </div>
          <div class="admin_table_empty" data-empty hidden>
            <p class="admin_empty_title">まだ登録された商品はありません</p>
            <p class="admin_empty_text">「新規追加」ボタンから最初の商品を登録してください。</p>
          </div>
        </div>

      <?php elseif ($info['type'] === 'kikaku'): ?>
        <!-- ============ KIKAKU ============ -->
        <p class="admin_panel_desc">
          各企画はカード形式で表示されます。カードをクリックして編集、または「+ 新規追加」で企画を追加できます。
        </p>
        <div class="admin_toolbar">
          <div class="admin_search_wrap">
            <svg class="admin_search_icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="search" class="admin_toolbar_search" placeholder="企画名・団体名・場所で検索..." data-table-search>
          </div>
          <button type="button" class="admin_btn admin_btn_primary" data-action="add">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            新規追加
          </button>
        </div>
        <div class="admin_kikaku_grid" data-tbody></div>
        <div class="admin_table_empty" data-empty hidden>
          <p class="admin_empty_title">まだ登録された企画はありません</p>
          <p class="admin_empty_text">「新規追加」ボタンから最初の企画を登録してください。</p>
        </div>

      <?php elseif ($info['type'] === 'leaflet'): ?>
        <!-- ============ LEAFLET POIs ============ -->
        <p class="admin_panel_desc">
          リーフレット上のピン情報を編集できます。表面 (omote) / 裏面 (ura) でタブを切り替えて編集してください。
        </p>
        <div class="admin_subtabs" role="tablist">
          <button type="button" class="admin_subtab active" data-leaflet-side="omote" role="tab" aria-selected="true">
            <span>表面</span><small>omote</small>
          </button>
          <button type="button" class="admin_subtab" data-leaflet-side="ura" role="tab" aria-selected="false">
            <span>裏面</span><small>ura</small>
          </button>
        </div>
        <div class="admin_toolbar">
          <div class="admin_search_wrap">
            <svg class="admin_search_icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="search" class="admin_toolbar_search" placeholder="POI名・カテゴリで検索..." data-table-search>
          </div>
          <button type="button" class="admin_btn admin_btn_primary" data-action="add">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            新規追加
          </button>
        </div>
        <div class="admin_card admin_card_table">
          <div class="admin_table_wrap">
            <table class="admin_table" data-table>
              <thead>
                <tr>
                  <th class="col_id">ID</th>
                  <th class="col_title">名称</th>
                  <th class="col_cat">カテゴリ</th>
                  <th class="col_xy">X座標</th>
                  <th class="col_xy">Y座標</th>
                  <th class="col_kw">キーワード</th>
                  <th class="col_actions" aria-label="操作"></th>
                </tr>
              </thead>
              <tbody data-tbody></tbody>
            </table>
          </div>
          <div class="admin_table_empty" data-empty hidden>
            <p class="admin_empty_title">このサイドにはまだPOIがありません</p>
            <p class="admin_empty_text">「新規追加」ボタンからピンを追加してください。</p>
          </div>
        </div>

      <?php elseif ($info['type'] === 'json'): ?>
        <!-- ============ TIMETABLE (JSON) ============ -->
        <p class="admin_panel_desc">
          タイムテーブルは構造が複雑なため、引き続きJSONで編集します。読み取り専用のサマリープレビューも表示されます。
        </p>
        <div class="admin_card">
          <div class="admin_card_title">
            <span>JSONエディタ</span>
            <button type="button" class="admin_btn admin_btn_outline" style="margin-left:auto;font-size:11px;padding:6px 12px;" data-action="format-json">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              整形
            </button>
          </div>
          <textarea class="admin_input admin_json_textarea" data-json-textarea placeholder="JSONを入力..."></textarea>
        </div>
        <div class="admin_card">
          <div class="admin_card_title">プレビュー（読み取り専用）</div>
          <div class="admin_timetable_preview" data-timetable-preview></div>
        </div>
      <?php endif; ?>

    </section>
    <?php $first = false; endforeach; ?>

    <!-- ============ Weather Mode Panel ============ -->
    <section class="admin_panel" id="panel_weather">
      <header class="admin_panel_header">
        <div class="admin_panel_titlewrap">
          <span class="admin_panel_icon">🌤️</span>
          <div>
            <h1 class="admin_panel_title">天候モード設定</h1>
            <p class="admin_panel_filename">タイムテーブルの表示切替</p>
          </div>
        </div>
      </header>
      <p class="admin_panel_desc">
        サイト訪問者に表示するタイムテーブルを切り替えます。<br>
        この設定は <code>pages/timetable.php</code> の <code>STAGE_WEATHER_MODE</code> に直接反映されます。
      </p>
      <form method="post" class="admin_card admin_weather_card">
        <input type="hidden" name="action" value="save_weather">
        <div class="admin_card_title">現在のモード</div>
        <div class="admin_weather_select">
          <label class="admin_weather_option <?= $current_weather === 'sunny' ? 'active' : '' ?>">
            <input type="radio" name="weather_mode" value="sunny" <?= $current_weather === 'sunny' ? 'checked' : '' ?>>
            <span class="admin_weather_emoji">☀️</span>
            <span class="admin_weather_lbl">晴天時</span>
            <span class="admin_weather_sub">通常スケジュール</span>
          </label>
          <label class="admin_weather_option <?= $current_weather === 'rainy' ? 'active' : '' ?>">
            <input type="radio" name="weather_mode" value="rainy" <?= $current_weather === 'rainy' ? 'checked' : '' ?>>
            <span class="admin_weather_emoji">🌧️</span>
            <span class="admin_weather_lbl">雨天時</span>
            <span class="admin_weather_sub">屋内振替スケジュール</span>
          </label>
        </div>
        <div style="margin-top:18px;">
          <button type="submit" class="admin_btn admin_btn_success">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            天候モードを保存
          </button>
        </div>
      </form>
    </section>
  </div>
</div>

<!-- ============ Universal Edit Modal ============ -->
<div class="admin_modal_overlay" id="admin_modal_overlay" role="presentation" hidden>
  <div class="admin_modal" role="dialog" aria-modal="true" aria-labelledby="admin_modal_title">
    <header class="admin_modal_header">
      <h2 class="admin_modal_title" id="admin_modal_title">編集</h2>
      <button type="button" class="admin_modal_close" id="admin_modal_close" aria-label="閉じる">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </header>
    <div class="admin_modal_body" id="admin_modal_body"></div>
    <footer class="admin_modal_footer">
      <button type="button" class="admin_btn admin_btn_danger" id="admin_modal_delete" hidden>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
        削除
      </button>
      <span style="flex:1"></span>
      <button type="button" class="admin_btn admin_btn_outline" id="admin_modal_cancel">キャンセル</button>
      <button type="button" class="admin_btn admin_btn_primary" id="admin_modal_apply">確定</button>
    </footer>
  </div>
</div>

<!-- ============ Confirm Dialog ============ -->
<div class="admin_modal_overlay" id="admin_confirm_overlay" role="presentation" hidden>
  <div class="admin_modal admin_modal_small" role="dialog" aria-modal="true">
    <header class="admin_modal_header">
      <h2 class="admin_modal_title" id="admin_confirm_title">確認</h2>
    </header>
    <div class="admin_modal_body">
      <p class="admin_confirm_msg" id="admin_confirm_msg"></p>
    </div>
    <footer class="admin_modal_footer">
      <span style="flex:1"></span>
      <button type="button" class="admin_btn admin_btn_outline" id="admin_confirm_cancel">キャンセル</button>
      <button type="button" class="admin_btn admin_btn_danger" id="admin_confirm_ok">実行</button>
    </footer>
  </div>
</div>

<!-- ============ Toast ============ -->
<div class="admin_toast" id="admin_toast"></div>

<!-- Embed initial data + config -->
<script>
window.ADMIN_INITIAL_DATA = <?= json_encode($initial_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;
window.ADMIN_FILE_INFO    = <?= json_encode($DATA_FILES, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;
<?php if ($save_message): ?>
window.ADMIN_FLASH = <?= json_encode($save_message) ?>;
<?php endif; ?>
</script>
<script src="./assets/js/admin.js"></script>
<?php endif; ?>

</body>
</html>
