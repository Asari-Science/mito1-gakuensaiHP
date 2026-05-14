<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>グッズ・お土産 | 第78回水戸一高・附属中学校学苑祭「天翔る」</title>
  <meta name="description" content="学苑祭のグッズ・お土産一覧。記念品・文具・お土産を写真付きで紹介、検索・カテゴリ絞り込み・価格ソートに対応。">
  <link rel="canonical" href="https://gakuensai.net/pages/goods.php">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/reset.css">
  <link rel="stylesheet" href="../assets/css/marketplace.css">
  <link rel="stylesheet" href="../assets/css/support-pack.css">
  <link rel="stylesheet" href="../assets/css/header.css">
  <link rel="stylesheet" href="../assets/css/footer.css">
  <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="../materials/favicon/favicon.ico">
  <link rel="manifest" href="../materials/favicon/manifest.json">
</head>
<body class="market_page goods_page">
  <?php $base_path = '..'; ?>
  <?php include(__DIR__ . "/../includes/header.php"); ?>
  <main class="market_main goods_theme" data-market-kind="goods" data-data-url="../assets/data/goods.json">
    <!-- ===== Hero ===== -->
    <section class="market_hero">
      <div class="market_hero_bg" aria-hidden="true"></div>
      <div class="market_hero_inner">
        <p class="market_label">Goods &amp; Souvenirs</p>
        <h1 class="market_hero_title">グッズ・お土産</h1>
        <p class="market_hero_sub">来場記念や贈り物にぴったりな、学苑祭オリジナルグッズと水戸銘菓のお土産をご紹介。</p>

        <!-- 学苑祭応援パック 告知ボタン -->
        <div class="support_pack_cta_wrap">
          <button id="support_pack_open" class="support_pack_cta" type="button"
                  aria-haspopup="dialog" aria-controls="support_pack_modal_overlay">
            <span class="support_pack_cta_badge" aria-hidden="true">限定100個</span>
            <span class="support_pack_cta_body">
              <span class="support_pack_cta_label">Support Pack</span>
              <span class="support_pack_cta_title">学苑祭応援パック 実施概要</span>
              <span class="support_pack_cta_sub">予約受付 5/18(月)〜5/31(金) ／ 詳細を見る</span>
            </span>
            <svg class="support_pack_cta_arrow" width="18" height="18" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        <div class="market_hero_stats" id="market_hero_stats" aria-hidden="true">
          <div class="market_hero_stat"><span class="num" data-stat="total">0</span><span class="lbl">商品</span></div>
          <div class="market_hero_stat"><span class="num" data-stat="cats">0</span><span class="lbl">カテゴリ</span></div>
          <div class="market_hero_stat"><span class="num" data-stat="cashless">0</span><span class="lbl">キャッシュレス</span></div>
        </div>
      </div>
    </section>

    <!-- ===== Controls ===== -->
    <section class="market_controls" aria-label="検索と絞り込み">
      <div class="market_controls_inner">
        <div class="market_search_wrap">
          <svg class="market_search_icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input id="market_search" class="market_search" type="search" placeholder="商品名・説明・販売場所で検索..." autocomplete="off" aria-label="グッズ検索">
          <button class="market_search_clear" id="market_search_clear" type="button" aria-label="検索条件をクリア">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="market_filter_group">
          <span class="market_filter_label">カテゴリ</span>
          <div class="market_filter_row" id="market_categories" role="group" aria-label="カテゴリで絞り込み"></div>
        </div>

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

    <!-- ===== 学苑祭応援パック モーダル ===== -->
    <div class="support_pack_modal_overlay" id="support_pack_modal_overlay" role="presentation" hidden>
      <article class="support_pack_modal" role="dialog" aria-modal="true"
               aria-labelledby="support_pack_modal_title" tabindex="-1">
        <button class="support_pack_modal_close" id="support_pack_modal_close"
                aria-label="閉じる" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <header class="support_pack_modal_header">
          <p class="support_pack_modal_eyebrow">Support Pack</p>
          <h2 id="support_pack_modal_title" class="support_pack_modal_title">学苑祭応援パック<span class="support_pack_modal_title_sub">実施概要</span></h2>
          <p class="support_pack_modal_lead">
            学苑祭の全グッズが購入できる「応援パック」が登場。<br>
            今後の運営支援として200円を上乗せした特別価格になります。<br>
            購入特典として、限定デザインの壁紙が貰えるQRコードが付属します。
          </p>
        </header>

        <section class="support_pack_modal_summary" aria-label="商品概要">
          <dl class="support_pack_summary_list">
            <div class="support_pack_summary_item">
              <dt>商品名</dt>
              <dd>学苑祭応援パック</dd>
            </div>
            <div class="support_pack_summary_item">
              <dt>価格</dt>
              <dd>
                <span class="support_pack_price">2,000<small>円</small></span>
                <span class="support_pack_price_break">グッズ合計額 1,800円 ＋ 学苑祭運営支援分 200円</span>
              </dd>
            </div>
            <div class="support_pack_summary_item">
              <dt>販売場所</dt>
              <dd>1Fホール</dd>
            </div>
          </dl>
        </section>

        <section class="support_pack_modal_section" aria-labelledby="support_pack_notes_heading">
          <h3 id="support_pack_notes_heading" class="support_pack_modal_section_title">
            <span class="support_pack_section_kicker">注意事項</span>
            <span class="support_pack_section_jp">ご利用にあたって</span>
          </h3>

          <ol class="support_pack_notes">
            <li class="support_pack_note">
              <h4 class="support_pack_note_title"><span class="support_pack_note_num">1</span>申込</h4>
              <p>本パックは原則予約制です。公式サイト及びSNSに掲載しているGoogleフォームから予約が行えます。</p>
              <p class="support_pack_note_emphasis">募集期間：5/18(月)〜5/31(金)</p>
            </li>

            <li class="support_pack_note">
              <h4 class="support_pack_note_title"><span class="support_pack_note_num">2</span>受け渡し・お支払い</h4>
              <ul class="support_pack_note_list">
                <li>予約確認用QRコードを、Googleフォームに入力いただいたメールアドレス宛に送付します。当日には、グッズ販売ブースでそのQRコードをスタッフに提示していただき、本人確認を行います。</li>
                <li>学苑祭当日は大変な混雑による通信の悪化が予想されます。QRコードは事前にスクリーンショットすることを推奨します。</li>
                <li>代金は学苑祭当日の受け渡し時にお支払いいただきます。</li>
              </ul>
            </li>

            <li class="support_pack_note">
              <h4 class="support_pack_note_title"><span class="support_pack_note_num">3</span>数量</h4>
              <ul class="support_pack_note_list">
                <li>学苑祭応援パックは<strong>100個のみの限定販売</strong>です。予約数が上限に達し次第、受付を終了します。</li>
                <li>スマホやメール利用が難しい方への配慮として、学苑祭当日の応援パック販売も一定数実施予定です。ただし、数量には限りがあるため、確実に購入を希望される場合は事前予約フォームをご利用ください。</li>
              </ul>
            </li>

            <li class="support_pack_note">
              <h4 class="support_pack_note_title"><span class="support_pack_note_num">4</span>その他</h4>
              <ul class="support_pack_note_list">
                <li>予約された方が入場終了時間までに来場されなかった場合、在庫状況に応じて通常販売へ回す場合があります。</li>
                <li>通常のグッズ単品販売も別途実施予定です。</li>
                <li>予約フォームを通じて取得したメールアドレスは、予約システムの運用のみに利用いたします。また、保有する必要がなくなった場合は、速やかに廃棄または消去します。</li>
              </ul>
            </li>
          </ol>
        </section>

        <footer class="support_pack_modal_footer">
          <p class="support_pack_modal_outro">実施概要は上記のとおりです。<br>皆様のご予約・ご来場を心よりお待ちしております。</p>
        </footer>
      </article>
    </div>

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
  <script src="../assets/js/support-pack.js"></script>
</body>
</html>
