<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>プレビュー | 第78回水戸一高・附属中学校学苑祭「天翔る」</title>
  <meta name="description" content="実装済みページを確認するためのプレビューページです。今回追加されたステージタイムテーブルとMプロ・Aステセットリストの動作確認ができます。">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../assets/css/reset.css">
  <link rel="stylesheet" href="../assets/css/placeholder.css">
  <link rel="stylesheet" href="../assets/css/header.css">
  <link rel="stylesheet" href="../assets/css/footer.css">
  <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="../materials/favicon/favicon.ico">
  <link rel="manifest" href="../materials/favicon/manifest.json">

  <style>
    .preview_main { min-height:100vh; padding:120px 20px 80px;
      background:radial-gradient(circle at 50% 12%,rgba(255,255,255,.4),transparent 40%),linear-gradient(180deg,#dab584,#f6dc9f); }
    .preview_card { max-width:980px; margin:0 auto; padding:36px 32px;
      border-radius:24px; background:rgba(255,255,255,.78);
      border:1px solid rgba(26,18,7,.08); box-shadow:0 18px 48px rgba(26,18,7,.1); }
    .preview_card .preview_label { font-family:"Noto Sans JP",sans-serif;
      font-size:11px; letter-spacing:.32em; text-transform:uppercase;
      color:rgba(26,18,7,.5); margin-bottom:10px; text-align:center; }
    .preview_card h1 { font-family:"Zen Old Mincho",serif; font-weight:900;
      font-size:clamp(26px,5vw,40px); letter-spacing:.06em; text-align:center; }
    .preview_lead { max-width:640px; margin:14px auto 28px; text-align:center;
      font-family:"Shippori Mincho",serif; line-height:1.95; color:rgba(26,18,7,.72); }
    .preview_section { margin-top:28px; padding-top:24px; border-top:1px dashed rgba(26,18,7,.18); }
    .preview_section h2 { font-family:"Zen Old Mincho",serif; font-size:20px;
      font-weight:900; margin-bottom:12px; }
    .preview_section p { font-family:"Shippori Mincho",serif; line-height:1.9;
      color:rgba(26,18,7,.74); margin-bottom:16px; font-size:14px; }
    .preview_grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; }
    .preview_link { display:flex; flex-direction:column; gap:4px; padding:16px 18px;
      border-radius:14px; background:rgba(26,18,7,.04);
      border:1px solid rgba(26,18,7,.1); text-decoration:none; color:#1a1207;
      transition:.2s ease; }
    .preview_link:hover { background:#1a1207; color:#f6dc9f; transform:translateY(-2px);
      box-shadow:0 10px 22px rgba(26,18,7,.15); }
    .preview_link strong { font-family:"Noto Sans JP",sans-serif; font-weight:700;
      font-size:14px; }
    .preview_link span { font-family:"Noto Sans JP",sans-serif; font-size:11px;
      opacity:.7; letter-spacing:.05em; }
    .preview_note { margin-top:18px; padding:14px 18px; border-radius:14px;
      background:rgba(255,231,159,.5); border:1px solid rgba(224,159,39,.3);
      font-family:"Noto Sans JP",sans-serif; font-size:13px; color:rgba(26,18,7,.78);
      line-height:1.7; }
    .preview_note code { padding:1px 6px; border-radius:5px; background:rgba(26,18,7,.1);
      font-family:Consolas,monospace; font-size:12px; }
    .preview_back { display:inline-flex; margin:26px auto 0; padding:12px 24px;
      border-radius:999px; border:1.5px solid rgba(26,18,7,.2); color:#1a1207;
      text-decoration:none; font-family:"Noto Sans JP",sans-serif; font-weight:700;
      font-size:14px; }
    .preview_actions { text-align:center; }
  </style>
</head>
<body class="placeholder_page">
  <?php $base_path = '..'; ?>
  <?php include(__DIR__ . "/../includes/header.php"); ?>

  <main class="preview_main">
    <section class="preview_card">
      <p class="preview_label">Preview</p>
      <h1>実装プレビュー</h1>
      <p class="preview_lead">
        今回追加・更新したページの確認用リンクです。<br>
        ステージタイムテーブルとMプロ・Aステセットリスト関連の機能をプレビューできます。
      </p>

      <!-- 今回の主要追加 -->
      <div class="preview_section">
        <h2>★ 今回の主要追加：ステージタイムテーブル</h2>
        <p>晴天時・雨天時のスケジュールをJSONから取得。来場者には切り替えさせず、ソース内の <code>window.STAGE_WEATHER_MODE</code> を <code>'sunny'</code> / <code>'rainy'</code> に書き換えるだけで表示が切替わります。1日目／2日目のタブ、5ステージ（体育館・中庭・パティオ・階段教室・音楽室）の縦軸時間×横軸ステージ表示、現在時刻の動的赤線、企画紹介・セットリストへのリンクに対応。</p>
        <div class="preview_grid">
          <a class="preview_link" href="./timetable.php">
            <strong>ステージタイムテーブル</strong>
            <span>/pages/timetable.php</span>
          </a>
          <a class="preview_link" href="./setlist.php">
            <strong>Mプロ・Aステ セットリスト</strong>
            <span>/pages/setlist.php (プレースホルダー)</span>
          </a>
          <a class="preview_link" href="../assets/data/stage_timetable.json" target="_blank" rel="noopener">
            <strong>タイムテーブルJSON</strong>
            <span>/assets/data/stage_timetable.json</span>
          </a>
        </div>
        <div class="preview_note">
          <strong>晴天⇄雨天の切替方法:</strong> <code>pages/timetable.php</code> 内の以下の行を編集してください。<br>
          <code>window.STAGE_WEATHER_MODE = 'sunny';</code> → <code>window.STAGE_WEATHER_MODE = 'rainy';</code>
        </div>
      </div>

      <!-- 関連ページ -->
      <div class="preview_section">
        <h2>関連ページ</h2>
        <div class="preview_grid">
          <a class="preview_link" href="./kikaku.php">
            <strong>企画紹介</strong>
            <span>/pages/kikaku.php (各演目の遷移先)</span>
          </a>
          <a class="preview_link" href="./leaflet.php">
            <strong>デジタルリーフレット</strong>
            <span>/pages/leaflet.php</span>
          </a>
          <a class="preview_link" href="./sitemap.php">
            <strong>サイトマップ</strong>
            <span>/pages/sitemap.php</span>
          </a>
          <a class="preview_link" href="./cafe.php">
            <strong>喫茶メニュー</strong>
            <span>/pages/cafe.php</span>
          </a>
          <a class="preview_link" href="./goods.php">
            <strong>グッズ・お土産</strong>
            <span>/pages/goods.php</span>
          </a>
          <a class="preview_link" href="./greetings.php">
            <strong>代表者挨拶</strong>
            <span>/pages/greetings.php (準備中)</span>
          </a>
        </div>
      </div>

      <div class="preview_actions">
        <a class="preview_back" href="https://gakuensai.net">← トップページに戻る</a>
      </div>
    </section>
  </main>

  <?php include(__DIR__ . "/../includes/footer.php"); ?>
  <script src="../assets/js/menu.js"></script>
</body>
</html>
