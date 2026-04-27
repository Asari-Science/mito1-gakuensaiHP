<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>喫茶メニュー | 第78回水戸一高・附属中学校学苑祭「天翔る」</title>
  <meta name="description" content="学苑祭で販売予定の喫茶メニュー一覧。検索・カテゴリ絞り込みに対応。">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/reset.css">
  <link rel="stylesheet" href="../assets/css/marketplace.css">
  <link rel="stylesheet" href="../assets/css/header.css">
  <link rel="stylesheet" href="../assets/css/footer.css">
  <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="../materials/favicon/favicon.ico">
  <link rel="manifest" href="../materials/favicon/manifest.json">
</head>
<body class="market_page cafe_page">
  <?php $base_path = '..'; ?>
  <?php include(__DIR__ . "/../includes/header.php"); ?>
  <main class="market_main cafe_theme" data-market-kind="cafe" data-data-url="../assets/data/cafe_menu.json">
    <section class="market_hero">
      <p class="market_label">Cafe Menu</p>
      <h1>喫茶メニュー</h1>
      <p>ひと休みしたい時に立ち寄れる、学苑祭の喫茶メニューをカード形式で紹介します。</p>
    </section>
    <section class="market_controls" aria-label="検索と絞り込み">
      <div class="market_search_wrap">
        <input id="market_search" class="market_search" type="search" placeholder="商品名・説明・販売場所で検索..." autocomplete="off">
      </div>
      <div class="market_filter_row" id="market_categories"></div>
      <div class="market_filter_row">
        <button class="market_chip active" data-cashless="all">すべて</button>
        <button class="market_chip" data-cashless="true">キャッシュレス対応</button>
        <button class="market_chip" data-cashless="false">現金のみ</button>
      </div>
      <p class="market_count" id="market_count"></p>
    </section>
    <section class="market_grid" id="market_grid"></section>
    <div class="market_modal_overlay" id="market_modal_overlay">
      <article class="market_modal" role="dialog" aria-modal="true" aria-labelledby="market_modal_title">
        <button class="market_modal_close" id="market_modal_close" aria-label="閉じる">×</button>
        <img id="market_modal_img" class="market_modal_img" alt="">
        <div class="market_modal_body">
          <p class="market_modal_category" id="market_modal_category"></p>
          <h2 id="market_modal_title"></h2>
          <p id="market_modal_desc"></p>
          <dl class="market_modal_info">
            <div><dt>金額</dt><dd id="market_modal_price"></dd></div>
            <div><dt>販売場所</dt><dd id="market_modal_seller"></dd></div>
            <div><dt>決済</dt><dd id="market_modal_cashless"></dd></div>
            <div><dt>在庫数</dt><dd id="market_modal_stock"></dd></div>
          </dl>
        </div>
      </article>
    </div>
  </main>
  <?php include(__DIR__ . "/../includes/footer.php"); ?>
  <script src="../assets/js/menu.js"></script>
  <script src="../assets/js/marketplace.js"></script>
</body>
</html>
