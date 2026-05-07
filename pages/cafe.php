<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>喫茶メニュー | 第78回水戸一高・附属中学校学苑祭「天翔る」</title>
  <meta name="description" content="学苑祭で販売予定の喫茶メニュー一覧。ドリンクやスイーツを写真付きで紹介、検索・カテゴリ絞り込み・価格ソートに対応。">
  <link rel="canonical" href="https://gakuensai.net/pages/cafe.php">
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
    <!-- ===== Hero ===== -->
    <section class="market_hero">
      <div class="market_hero_bg" aria-hidden="true"></div>
      <div class="market_hero_inner">
        <p class="market_label">Cafe Menu</p>
        <h1 class="market_hero_title">喫茶メニュー</h1>
        <p class="market_hero_sub">空の旅のひと休みに。学苑祭の喫茶班が贈る、こだわりの一杯と一皿。</p>
        <div class="market_hero_stats" id="market_hero_stats" aria-hidden="true">
          <div class="market_hero_stat"><span class="num" data-stat="total">0</span><span class="lbl">メニュー</span></div>
          <div class="market_hero_stat"><span class="num" data-stat="cats">0</span><span class="lbl">カテゴリ</span></div>
          <div class="market_hero_stat"><span class="num" data-stat="cashless">0</span><span class="lbl">キャッシュレス</span></div>
        </div>
      </div>
    </section>

    <!-- ===== Controls ===== -->
    <section class="market_controls" aria-label="検索と絞り込み">
      <div class="market_controls_inner">
        <!-- Search row -->
        <div class="market_search_wrap">
          <svg class="market_search_icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input id="market_search" class="market_search" type="search" placeholder="商品名・説明・販売場所で検索..." autocomplete="off" aria-label="メニュー検索">
          <button class="market_search_clear" id="market_search_clear" type="button" aria-label="検索条件をクリア">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Category chips -->
        <div class="market_filter_group">
          <span class="market_filter_label">カテゴリ</span>
          <div class="market_filter_row" id="market_categories" role="group" aria-label="カテゴリで絞り込み"></div>
        </div>

        <!-- Cashless + Sort row -->
        <div class="market_filter_bottom">
          <div class="market_filter_group">
            <span class="market_filter_label">決済</span>
            <div class="market_filter_row" role="group" aria-label="決済方法で絞り込み">
              <button class="market_chip active" data-cashless="all" type="button">すべて</button>
              <button class="market_chip" data-cashless="true" type="button">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="6" width="20" height="14" rx="2"/><line x1="2" y1="11" x2="22" y2="11"/></svg>
                キャッシュレス
              </button>
              <button class="market_chip" data-cashless="false" type="button">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5h4.5a1.5 1.5 0 010 3H10a1.5 1.5 0 000 3h5"/></svg>
                現金のみ
              </button>
            </div>
          </div>
          <div class="market_sort_wrap">
            <label for="market_sort" class="market_filter_label">並び順</label>
            <div class="market_select_wrap">
              <select id="market_sort" class="market_select" aria-label="並び順">
                <option value="default">標準</option>
                <option value="price_asc">価格が安い順</option>
                <option value="price_desc">価格が高い順</option>
                <option value="name">名前順</option>
              </select>
              <svg class="market_select_arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>

        <!-- Result counter -->
        <div class="market_meta_row">
          <p class="market_count" id="market_count" aria-live="polite"></p>
          <button class="market_reset_btn" id="market_reset_btn" type="button" hidden>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>
            条件をリセット
          </button>
        </div>
      </div>
    </section>

    <!-- ===== Grid ===== -->
    <section class="market_grid_wrap">
      <div class="market_grid" id="market_grid" aria-busy="true"></div>
    </section>

    <!-- ===== Modal ===== -->
    <div class="market_modal_overlay" id="market_modal_overlay" role="presentation">
      <article class="market_modal" role="dialog" aria-modal="true" aria-labelledby="market_modal_title">
        <button class="market_modal_close" id="market_modal_close" aria-label="閉じる" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="market_modal_imgwrap">
          <img id="market_modal_img" class="market_modal_img" alt="" loading="lazy">
          <span class="market_modal_category" id="market_modal_category"></span>
        </div>
        <div class="market_modal_body">
          <h2 id="market_modal_title" class="market_modal_title"></h2>
          <p id="market_modal_desc" class="market_modal_desc"></p>
          <dl class="market_modal_info">
            <div id="market_modal_price_wrap">
              <dt>金額</dt>
              <dd id="market_modal_price"></dd>
            </div>
            <div>
              <dt>販売場所</dt>
              <dd id="market_modal_seller"></dd>
            </div>
            <div>
              <dt>決済</dt>
              <dd id="market_modal_cashless"></dd>
            </div>
            <div id="market_modal_stock_wrap">
              <dt>在庫数</dt>
              <dd id="market_modal_stock"></dd>
            </div>
          </dl>
          <div id="market_modal_variations"></div>
        </div>
      </article>
    </div>
  </main>
  <?php include(__DIR__ . "/../includes/footer.php"); ?>
  <script src="../assets/js/menu.js"></script>
  <script src="../assets/js/marketplace.js"></script>
</body>
</html>
