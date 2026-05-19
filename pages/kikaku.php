<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>企画紹介 | 第78回水戸一高・附属中学校学苑祭「天翔る」</title>
        <meta name="description" content="第78回学苑祭「天翔る」の全企画を紹介。アトラクション、喫茶、ステージ、展示など多彩な企画が勢ぞろい。">
        <link rel="canonical" href="https://gakuensai.net/pages/kikaku.php">

        <!-- SEO OGP -->
        <meta property="og:title" content="企画紹介 | 第78回学苑祭「天翔る」" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="第78回学苑祭「天翔る」の全企画を紹介。アトラクション、喫茶、ステージ、展示など。" />
        <meta property="og:url" content="https://gakuensai.net/pages/kikaku.php" />
        <meta property="og:image" content="https://gakuensai.net/materials/enjitsu78th.webp" />

        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">

        <link rel="stylesheet" type="text/css" href="../assets/css/reset.css">
        <link rel="stylesheet" type="text/css" href="../assets/css/kikaku.css">
        <link rel="stylesheet" type="text/css" href="../assets/css/header.css">
        <link rel="stylesheet" type="text/css" href="../assets/css/footer.css">

        <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="../materials/favicon/favicon.ico">
        <link rel="icon" type="image/vnd.microsoft.icon" href="../materials/favicon/favicon.ico">
        <link rel="apple-touch-icon" sizes="180x180" href="../materials/favicon/apple-touch-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192" href="../materials/favicon/android-chrome-192x192.png">

        <link rel="manifest" href="../materials/favicon/manifest.json">

    </head>
    <body>
        <?php $base_path = '..'; ?>
        <!-- Header -->
         <?php include(__DIR__ . "/../includes/header.php"); ?>
        <!-- Main -->
         <main class="kikaku_main">
            <!-- Hero -->
            <section class="kikaku_hero">
                <div class="kikaku_hero_bg"></div>
                <div class="kikaku_hero_content">
                    <p class="kikaku_hero_label">Events</p>
                    <h1 class="kikaku_hero_title">企画紹介</h1>
                    <p class="kikaku_hero_sub">第78回学苑祭「天翔る」の全企画をご紹介します。</p>
                </div>
            </section>

            <!-- Search & Filter -->
            <section class="kikaku_controls">
                <div class="kikaku_controls_inner">
                    <!-- Search -->
                    <div class="kikaku_search_wrap">
                        <svg class="kikaku_search_icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" class="kikaku_search" id="kikaku_search" placeholder="企画名（読み仮名OK）・団体名・キーワードで検索..." autocomplete="off">
                        <button class="kikaku_search_clear" id="kikaku_search_clear" aria-label="検索をクリア">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                    <!-- Genre Filter -->
                    <div class="kikaku_filters" id="kikaku_filters">
                        <button class="kikaku_filter_btn active" data-genre="all">すべて</button>
                        <button class="kikaku_filter_btn" data-genre="喫茶">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                            喫茶
                        </button>
                        <button class="kikaku_filter_btn" data-genre="アトラクション（ホラー）">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 14s1.5-2 3-2 3 2 3 2"/><path d="M9 20s1.5-1 3-1 3 1 3 1"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/><path d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>
                            アトラクション（ホラー）
                        </button>
                        <button class="kikaku_filter_btn" data-genre="アトラクション（ホラー以外）">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                            アトラクション（ホラー以外）
                        </button>
                        <button class="kikaku_filter_btn" data-genre="創作展示">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            創作展示
                        </button>
                        <button class="kikaku_filter_btn" data-genre="映像作品">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                            映像作品
                        </button>
                        <button class="kikaku_filter_btn" data-genre="ステージ">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                            ステージ
                        </button>
                        <button class="kikaku_filter_btn" data-genre="縁日">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 22v-9l10-9 10 9v9"/><path d="M9 22V9h6v13"/><path d="M12 2v2"/><path d="M12 4.5V6"/></svg>
                            縁日
                        </button>
                    </div>
                    <!-- Day Filter -->
                    <div class="kikaku_day_filters" id="kikaku_day_filters">
                        <button class="kikaku_day_btn active" data-day="all">両日</button>
                        <button class="kikaku_day_btn" data-day="day1">Day 1 (6/20)</button>
                        <button class="kikaku_day_btn" data-day="day2">Day 2 (6/21)</button>
                    </div>
                    <!-- Result count -->
                    <p class="kikaku_result_count" id="kikaku_result_count"></p>
                </div>
            </section>

            <!-- Cards Grid -->
            <section class="kikaku_grid_section">
                <div class="kikaku_grid" id="kikaku_grid">
                    <!-- Cards injected by JS -->
                </div>
                <div class="kikaku_empty" id="kikaku_empty" style="display:none;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                    <p class="kikaku_empty_text">条件に一致する企画が見つかりませんでした。</p>
                    <button class="kikaku_empty_reset" id="kikaku_empty_reset">フィルターをリセット</button>
                </div>
            </section>

            <!-- Modal -->
            <div class="kikaku_modal_overlay" id="kikaku_modal_overlay">
                <div class="kikaku_modal" id="kikaku_modal" role="dialog" aria-modal="true">
                    <button class="kikaku_modal_close" id="kikaku_modal_close" aria-label="閉じる">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                    <!-- Image Carousel -->
                    <div class="kikaku_modal_carousel" id="kikaku_modal_carousel">
                        <div class="kikaku_carousel_track" id="kikaku_carousel_track"></div>
                        <button class="kikaku_carousel_prev" id="kikaku_carousel_prev" aria-label="前の画像">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <button class="kikaku_carousel_next" id="kikaku_carousel_next" aria-label="次の画像">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 6 15 12 9 18"/></svg>
                        </button>
                        <div class="kikaku_carousel_dots" id="kikaku_carousel_dots"></div>
                    </div>
                    <!-- Details -->
                    <div class="kikaku_modal_body">
                        <div class="kikaku_modal_meta">
                            <span class="kikaku_modal_genre" id="kikaku_modal_genre"></span>
                            <span class="kikaku_modal_id" id="kikaku_modal_id"></span>
                        </div>
                        <p class="kikaku_modal_title_kana" id="kikaku_modal_title_kana" aria-hidden="true"></p>
                        <h2 class="kikaku_modal_title" id="kikaku_modal_title"></h2>
                        <p class="kikaku_modal_group" id="kikaku_modal_group"></p>
                        <div class="kikaku_modal_divider"></div>
                        <p class="kikaku_modal_desc" id="kikaku_modal_desc"></p>
                        <div class="kikaku_modal_divider"></div>
                        <div class="kikaku_modal_info">
                            <div class="kikaku_modal_info_row">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                <span id="kikaku_modal_location"></span>
                                <a href="#" class="kikaku_modal_map_link" id="kikaku_modal_map_link" title="リーフレットで場所を確認">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                    地図
                                </a>
                            </div>
                            <div class="kikaku_modal_info_row">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                <span id="kikaku_modal_day"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </main>
        <!-- Footer -->
         <?php include(__DIR__ . "/../includes/footer.php"); ?>
        <!-- Script -->
         <script src="../assets/js/menu.js"></script>
         <script src="../assets/js/kikaku.js"></script>
    </body>
</html>
