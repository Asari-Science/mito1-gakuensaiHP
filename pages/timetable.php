<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ステージタイムテーブル | 第78回水戸一高・附属中学校学苑祭「天翔る」</title>
  <meta name="description" content="晴天時・雨天時に対応したステージタイムテーブル。1日目・2日目をタブで切り替えられます。">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/reset.css">
  <link rel="stylesheet" href="../assets/css/timetable.css">
  <link rel="stylesheet" href="../assets/css/header.css">
  <link rel="stylesheet" href="../assets/css/footer.css">
  <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="../materials/favicon/favicon.ico">
  <link rel="manifest" href="../materials/favicon/manifest.json">
</head>
<body class="timetable_page">
  <?php $base_path = '..'; ?>
  <?php include(__DIR__ . "/../includes/header.php"); ?>
  <main class="timetable_main">
    <section class="tt_hero">
      <p class="tt_label">Stage Timetable</p>
      <h1>ステージタイムテーブル</h1>
      <p>縦軸が時間、横軸がステージのタイムラインです。各演目から企画紹介・セットリストへ移動できます。</p>
    </section>
    <section class="tt_notice" id="tt_weather_notice" aria-live="polite"></section>
    <section class="tt_stage_intro" id="tt_stage_intro"></section>
    <section class="tt_day_tabs" role="tablist" aria-label="日程切り替え">
      <button class="tt_day_tab active" id="tt_tab_day1" data-day="day1" role="tab" aria-selected="true">1日目 <span>6/20</span></button>
      <button class="tt_day_tab" id="tt_tab_day2" data-day="day2" role="tab" aria-selected="false">2日目 <span>6/21</span></button>
    </section>
    <section class="tt_board_section">
      <div class="tt_board_hint">横にステージ、縦に時間が並びます。赤線は現在時刻です。</div>
      <div class="tt_board_wrap" id="tt_board_wrap">
        <div class="tt_board" id="tt_board"></div>
      </div>
    </section>
  </main>
  <?php include(__DIR__ . "/../includes/footer.php"); ?>
  <script src="../assets/js/menu.js"></script>
  <script>
    // 表示する天候スケジュールはこの変数だけを書き換えて変更します。値: 'sunny' または 'rainy'
    window.STAGE_WEATHER_MODE = 'sunny';
  </script>
  <script src="../assets/js/timetable.js"></script>
</body>
</html>
