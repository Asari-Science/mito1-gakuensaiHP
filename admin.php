<?php
session_start();

// --- Simple password authentication ---
// Password: "gakuensai2026" (hashed)
$ADMIN_PASS_HASH = '$2y$10$8KjGkT3xV5nW5Ld0R3qZXOYmVv2Jf6kU1pN8sA7hQ4wE9rT0yB6Cm';
$ADMIN_PASS_PLAIN = 'gakuensai2026'; // fallback comparison

$DATA_DIR = __DIR__ . '/assets/data/';
$DATA_FILES = [
    'cafe_menu'        => ['file' => 'cafe_menu.json',        'label' => '喫茶メニュー',       'icon' => '☕'],
    'goods'            => ['file' => 'goods.json',            'label' => 'グッズ・お土産',     'icon' => '🎁'],
    'kikaku'           => ['file' => 'kikaku.json',           'label' => '企画情報',           'icon' => '🎪'],
    'stage_timetable'  => ['file' => 'stage_timetable.json',  'label' => 'タイムテーブル',     'icon' => '🕐'],
    'leaflet_pois'     => ['file' => 'leaflet_pois.json',     'label' => 'リーフレットPOI',   'icon' => '📍'],
];

// Handle login
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

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// Handle save
$save_message = '';
if (isset($_POST['action']) && $_POST['action'] === 'save' && !empty($_SESSION['admin_auth'])) {
    $key = $_POST['data_key'] ?? '';
    if (isset($DATA_FILES[$key])) {
        $json_str = $_POST['json_content'] ?? '';
        $decoded = json_decode($json_str);
        if ($decoded === null && $json_str !== 'null') {
            $save_message = 'error:JSONの形式が正しくありません: ' . json_last_error_msg();
        } else {
            $pretty = json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $filepath = $DATA_DIR . $DATA_FILES[$key]['file'];
            if (file_put_contents($filepath, $pretty . "\n")) {
                $save_message = 'success:保存しました。';
            } else {
                $save_message = 'error:ファイルの書き込みに失敗しました。';
            }
        }
    }
}

// Handle weather mode save
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

// Read current weather mode
$current_weather = 'sunny';
$tt_content = @file_get_contents(__DIR__ . '/pages/timetable.php');
if ($tt_content && preg_match("/window\.STAGE_WEATHER_MODE\s*=\s*'([^']*)'/", $tt_content, $m)) {
    $current_weather = $m[1];
}

$is_logged_in = !empty($_SESSION['admin_auth']);
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
  <form class="admin_login_card" method="post">
    <input type="hidden" name="action" value="login">
    <div class="admin_login_logo">学苑祭 管理パネル</div>
    <p class="admin_login_sub">管理者用のページです。パスワードを入力してください。</p>
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
  <span class="admin_topbar_title">学苑祭 管理パネル</span>
  <span class="admin_topbar_spacer"></span>
  <span class="admin_topbar_user">管理者ログイン中</span>
  <a href="admin.php?logout=1" class="admin_topbar_logout">ログアウト</a>
</div>

<div class="admin_body">
  <!-- Sidebar -->
  <nav class="admin_sidebar">
    <div class="admin_sidebar_title">データ管理</div>
    <?php foreach ($DATA_FILES as $key => $info): ?>
      <button class="admin_sidebar_btn <?= $key === 'cafe_menu' ? 'active' : '' ?>"
              data-panel="panel_<?= $key ?>" onclick="switchPanel(this)">
        <span class="sidebar_icon"><?= $info['icon'] ?></span>
        <?= htmlspecialchars($info['label']) ?>
      </button>
    <?php endforeach; ?>
    <button class="admin_sidebar_btn" data-panel="panel_weather" onclick="switchPanel(this)">
      <span class="sidebar_icon">🌤️</span>
      天候モード
    </button>
  </nav>

  <!-- Content -->
  <div class="admin_content">
    <?php foreach ($DATA_FILES as $key => $info):
      $filepath = $DATA_DIR . $info['file'];
      $json_raw = file_exists($filepath) ? file_get_contents($filepath) : '[]';
    ?>
    <div class="admin_panel <?= $key === 'cafe_menu' ? 'active' : '' ?>" id="panel_<?= $key ?>">
      <div class="admin_panel_header">
        <h1 class="admin_panel_title"><?= $info['icon'] ?> <?= htmlspecialchars($info['label']) ?></h1>
      </div>
      <p class="admin_panel_desc">
        <code><?= htmlspecialchars($info['file']) ?></code> を編集します。JSON形式で入力してください。
      </p>
      <form method="post" onsubmit="return validateJson(this)">
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="data_key" value="<?= $key ?>">
        <div class="admin_card">
          <div class="admin_card_title">
            JSONエディタ
            <button type="button" class="admin_btn admin_btn_outline" style="margin-left:auto;font-size:11px;" onclick="formatJson(this)">整形</button>
          </div>
          <textarea name="json_content" class="admin_input" style="min-height:400px;font-family:monospace;font-size:13px;line-height:1.5;white-space:pre;tab-size:2;"><?= htmlspecialchars($json_raw) ?></textarea>
        </div>
        <div style="display:flex;gap:10px;align-items:center;">
          <button type="submit" class="admin_btn admin_btn_success">💾 保存</button>
          <span class="admin_save_status"></span>
        </div>
      </form>
    </div>
    <?php endforeach; ?>

    <!-- Weather Mode Panel -->
    <div class="admin_panel" id="panel_weather">
      <div class="admin_panel_header">
        <h1 class="admin_panel_title">🌤️ 天候モード設定</h1>
      </div>
      <p class="admin_panel_desc">
        タイムテーブルに表示する天候スケジュールを切り替えます。<br>
        この設定は <code>pages/timetable.php</code> の <code>STAGE_WEATHER_MODE</code> を直接書き換えます。
      </p>
      <div class="admin_card">
        <form method="post">
          <input type="hidden" name="action" value="save_weather">
          <div class="admin_card_title">現在のモード</div>
          <div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;">
            <div class="admin_weather_toggle">
              <button type="button" class="admin_weather_btn <?= $current_weather === 'sunny' ? 'active' : '' ?>"
                      onclick="setWeather(this,'sunny')">☀️ 晴天時</button>
              <button type="button" class="admin_weather_btn <?= $current_weather === 'rainy' ? 'active' : '' ?>"
                      onclick="setWeather(this,'rainy')">🌧️ 雨天時</button>
            </div>
            <input type="hidden" name="weather_mode" id="weather_mode" value="<?= htmlspecialchars($current_weather) ?>">
          </div>
          <button type="submit" class="admin_btn admin_btn_success">💾 天候モードを保存</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Toast -->
<div class="admin_toast" id="admin_toast"></div>

<?php if ($save_message): ?>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    var msg = <?= json_encode($save_message) ?>;
    var parts = msg.split(':');
    showToast(parts.slice(1).join(':'), parts[0]);
  });
</script>
<?php endif; ?>

<script>
function switchPanel(btn) {
  document.querySelectorAll('.admin_sidebar_btn').forEach(function(b) { b.classList.remove('active'); });
  document.querySelectorAll('.admin_panel').forEach(function(p) { p.classList.remove('active'); });
  btn.classList.add('active');
  var panel = document.getElementById(btn.dataset.panel);
  if (panel) panel.classList.add('active');
}

function formatJson(btn) {
  var textarea = btn.closest('.admin_card').querySelector('textarea');
  try {
    var obj = JSON.parse(textarea.value);
    textarea.value = JSON.stringify(obj, null, 2);
    showToast('JSONを整形しました', 'success');
  } catch(e) {
    showToast('JSON形式エラー: ' + e.message, 'error');
  }
}

function validateJson(form) {
  var textarea = form.querySelector('textarea[name="json_content"]');
  try {
    JSON.parse(textarea.value);
    return true;
  } catch(e) {
    showToast('JSON形式エラー: ' + e.message, 'error');
    return false;
  }
}

function setWeather(btn, mode) {
  document.querySelectorAll('.admin_weather_btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('weather_mode').value = mode;
}

function showToast(msg, type) {
  var toast = document.getElementById('admin_toast');
  toast.textContent = msg;
  toast.className = 'admin_toast ' + type + ' show';
  setTimeout(function() { toast.classList.remove('show'); }, 3000);
}
</script>
<?php endif; ?>

</body>
</html>
