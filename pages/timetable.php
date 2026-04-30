<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ステージタイムテーブル | 第78回水戸一高・附属中学校学苑祭「天翔る」</title>
  <meta name="description" content="第78回学苑祭「天翔る」のステージタイムテーブル。晴天時・雨天時のスケジュール、5つのステージ（体育館・中庭・パティオ・階段教室・音楽室）の演目を時間軸で表示します。">

  <!-- SEO OGP -->
  <meta property="og:title" content="ステージタイムテーブル | 第78回学苑祭「天翔る」" />
  <meta property="og:type" content="website" />
  <meta property="og:description" content="晴天時・雨天時に対応したステージタイムテーブル。1日目・2日目をタブで切り替えられます。" />
  <meta property="og:url" content="https://gakuensai.net/pages/timetable.php" />
  <meta property="og:image" content="https://gakuensai.net/materials/enjitsu78th.webp" />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../assets/css/reset.css">
  <link rel="stylesheet" href="../assets/css/timetable.css">
  <link rel="stylesheet" href="../assets/css/header.css">
  <link rel="stylesheet" href="../assets/css/footer.css">

  <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="../materials/favicon/favicon.ico">
  <link rel="icon" type="image/vnd.microsoft.icon" href="../materials/favicon/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="../materials/favicon/apple-touch-icon-180x180.png">
  <link rel="icon" type="image/png" sizes="192x192" href="../materials/favicon/android-chrome-192x192.png">
  <link rel="manifest" href="../materials/favicon/manifest.json">
</head>
<body class="timetable_page">
  <?php $base_path = '..'; ?>
  <!-- Header -->
  <?php include(__DIR__ . "/../includes/header.php"); ?>

  <!-- Main -->
  <main class="timetable_main">
    <!-- Hero -->
    <section class="tt_hero">
      <p class="tt_label">Stage Timetable</p>
      <h1>ステージタイムテーブル</h1>
      <p>5つのステージで繰り広げられる、2日間のステージプログラム。<br>縦軸が時間、横軸がステージのタイムラインです。各演目から企画紹介・セットリストへ移動できます。</p>
    </section>

    <!-- Weather notice (sunny/rainy auto-display) -->
    <section class="tt_notice" id="tt_weather_notice" aria-live="polite">
      <span class="tt_notice_icon" aria-hidden="true"></span>
      <span class="tt_notice_text">読み込み中...</span>
    </section>

    <!-- Mプロ・Aステ description (☆Mプロ / ☆Aステ) -->
    <section class="tt_stage_intro" id="tt_stage_intro" aria-label="Mプロ・Aステの解説"></section>

    <!-- Day Tabs -->
    <section class="tt_day_tabs" role="tablist" aria-label="日程切り替え">
      <button class="tt_day_tab active" id="tt_tab_day1" data-day="day1" role="tab" aria-selected="true" aria-controls="tt_board">
        <span class="tt_day_tab_label">1日目</span>
        <span class="tt_day_tab_date">6/20</span>
      </button>
      <button class="tt_day_tab" id="tt_tab_day2" data-day="day2" role="tab" aria-selected="false" aria-controls="tt_board">
        <span class="tt_day_tab_label">2日目</span>
        <span class="tt_day_tab_date">6/21</span>
      </button>
    </section>

    <!-- Timetable Board -->
    <section class="tt_board_section">
      <div class="tt_board_meta" id="tt_board_meta" aria-live="polite"></div>
      <div class="tt_board_hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        左の縦軸が時間、上の横軸がステージです。<span class="tt_board_hint_red">赤線</span>は現在時刻を示します。横にスクロールできます。
      </div>
      <div class="tt_board_wrap" id="tt_board_wrap">
        <div class="tt_board" id="tt_board" role="tabpanel" aria-labelledby="tt_tab_day1"></div>
      </div>
    </section>

    <!-- Legend -->
    <section class="tt_legend" aria-label="ジャンル凡例">
      <h2 class="tt_legend_title">ジャンル凡例</h2>
      <ul class="tt_legend_list" id="tt_legend_list"></ul>
    </section>
  </main>

  <!-- Footer -->
  <?php include(__DIR__ . "/../includes/footer.php"); ?>

  <!-- Script -->
  <script src="../assets/js/menu.js"></script>
  <script>
    /**
     * 表示する天候スケジュールはこの変数だけを書き換えて変更します。
     * - 'sunny' : 晴天時スケジュール
     * - 'rainy' : 雨天時スケジュール
     * 来場者には切り替えさせず、運営側でソースを書き換えて設定します。
     */
    window.STAGE_WEATHER_MODE = 'sunny';
  </script>
  <script src="../assets/js/timetable.js"></script>
</body>
</html>
