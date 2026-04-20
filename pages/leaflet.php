<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

    <title>リーフレット | 第78回水戸一高・附属中学校学苑祭「天翔る」</title>
    <meta name="description" content="第78回学苑祭のデジタルリーフレット。裏表を切り替え、拡大・検索機能付きで会場案内をご覧いただけます。">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">

    <!-- OpenSeadragon (CDN) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/openseadragon.min.js" defer></script>

    <link rel="stylesheet" type="text/css" href="../assets/css/reset.css">
    <link rel="stylesheet" type="text/css" href="../assets/css/header.css">
    <link rel="stylesheet" type="text/css" href="../assets/css/footer.css">
    <link rel="stylesheet" type="text/css" href="../assets/css/leaflet.css">

    <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="../materials/favicon/favicon.ico">
    <link rel="icon" type="image/vnd.microsoft.icon" href="../materials/favicon/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="../materials/favicon/apple-touch-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192" href="../materials/favicon/android-chrome-192x192.png">

    <link rel="manifest" href="../materials/favicon/manifest.json">

    <!-- theme color (モバイルブラウザUIと調和させる) -->
    <meta name="theme-color" content="#1a1207">
</head>
<body class="leaflet_body">
    <?php $base_path = '..'; ?>

    <!-- Header (フローティング表示) -->
    <?php include(__DIR__ . "/../includes/header.php"); ?>

    <!-- Main -->
    <main class="leaflet_main" role="main" aria-label="デジタルリーフレット">
        <!-- ツールバー -->
        <div class="leaflet_toolbar" role="toolbar" aria-label="リーフレット操作">
            <div class="leaflet_toolbar_left">
                <a href="<?php echo $base_path; ?>/" class="leaflet_back_link" aria-label="トップページに戻る">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M19 12H5"/>
                        <path d="M12 19l-7-7 7-7"/>
                    </svg>
                    <span class="back_text">トップへ</span>
                </a>
            </div>

            <div class="leaflet_toolbar_center">
                <div class="leaflet_tabs" role="tablist" aria-label="リーフレット面切替">
                    <button class="leaflet_tab is-active" type="button" role="tab" aria-selected="true" data-side="omote">表</button>
                    <button class="leaflet_tab" type="button" role="tab" aria-selected="false" data-side="ura">裏</button>
                </div>
            </div>

            <div class="leaflet_toolbar_right">
                <div class="leaflet_search" role="search">
                    <svg class="leaflet_search_icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input
                        id="leaflet_search_input"
                        class="leaflet_search_input"
                        type="search"
                        autocomplete="off"
                        inputmode="search"
                        placeholder="企画・場所を検索…"
                        aria-label="リーフレット内を検索"
                    />
                    <button id="leaflet_search_clear" class="leaflet_search_clear" type="button" aria-label="検索をクリア">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                    <div id="leaflet_search_suggest" class="leaflet_search_suggest" role="listbox"></div>
                </div>

                <button class="leaflet_tool_btn" type="button" data-role="minimap" aria-label="ミニマップ表示切替" title="ミニマップ">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                        <line x1="8" y1="2" x2="8" y2="18"/>
                        <line x1="16" y1="6" x2="16" y2="22"/>
                    </svg>
                </button>

                <button class="leaflet_tool_btn" type="button" data-role="fullscreen" aria-label="フルスクリーン表示" title="フルスクリーン">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
                        <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
                        <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
                        <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- ビューア -->
        <div class="leaflet_viewer_wrap" data-side="omote">
            <div id="osd_omote" class="leaflet_viewer" aria-label="表面リーフレット"></div>
            <div id="pin_layer_omote" class="leaflet_pin_layer"></div>

            <!-- ローディング -->
            <div id="loader_omote" class="leaflet_loader" role="status" aria-live="polite">
                <div class="leaflet_loader_spinner" aria-hidden="true"></div>
                <span>リーフレットを読み込み中…</span>
            </div>

            <!-- ミニマップコンテナ (OpenSeadragon Navigator 描画先) -->
            <div id="minimap_omote" class="leaflet_minimap" aria-hidden="true">
                <div id="minimap_omote_inner" style="position:absolute;inset:0;"></div>
            </div>

        </div>

        <div class="leaflet_viewer_wrap" data-side="ura" hidden>
            <div id="osd_ura" class="leaflet_viewer" aria-label="裏面リーフレット"></div>
            <div id="pin_layer_ura" class="leaflet_pin_layer"></div>

            <div id="loader_ura" class="leaflet_loader" role="status" aria-live="polite">
                <div class="leaflet_loader_spinner" aria-hidden="true"></div>
                <span>リーフレットを読み込み中…</span>
            </div>

            <div id="minimap_ura" class="leaflet_minimap" aria-hidden="true">
                <div id="minimap_ura_inner" style="position:absolute;inset:0;"></div>
            </div>
        </div>

        <!-- ズームコントロール -->
        <div class="leaflet_zoom_controls" aria-hidden="false">
            <button class="leaflet_zoom_btn" type="button" data-role="zoom-in" aria-label="ズームイン" title="ズームイン">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
            </button>
            <button class="leaflet_zoom_btn" type="button" data-role="zoom-out" aria-label="ズームアウト" title="ズームアウト">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
            </button>
            <button class="leaflet_zoom_btn" type="button" data-role="home" aria-label="全体表示にリセット" title="全体表示">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M3 12L12 3l9 9"/>
                    <path d="M5 10v10h14V10"/>
                </svg>
            </button>
        </div>

        <!-- ヒント -->
        <div class="leaflet_hint" role="note">
            <span>ドラッグ / ピンチで移動・拡大　・　ピンをタップで詳細</span>
        </div>

        <!-- ピン詳細ポップアップ -->
        <div id="leaflet_popup" class="leaflet_popup" role="dialog" aria-modal="false" aria-live="polite">
            <button id="popup_close" class="leaflet_popup_close" type="button" aria-label="閉じる">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            <span id="popup_category" class="leaflet_popup_category"></span>
            <h2 id="popup_title" class="leaflet_popup_title"></h2>
            <div id="popup_desc" class="leaflet_popup_desc"></div>
        </div>
    </main>

    <!-- Footer (CSSで非表示) -->
    <?php include(__DIR__ . "/../includes/footer.php"); ?>

    <!-- ====================================================================
         POI (ピン) データは外部 JSON から読み込みます:
           /assets/data/leaflet_pois.json
         編集・追加する際はこのJSONを直接書き換えてください。
         フォーマット・座標の調べ方はJSON内の $schema フィールドを参照。

         ディープリンク:
           URLに #omote:stage のように記述すると、該当ピンに直接ジャンプ可能。
    ==================================================================== -->
    <script>
        window.LEAFLET_CONFIG = window.LEAFLET_CONFIG || {};
        window.LEAFLET_CONFIG.poisUrl = '../assets/data/leaflet_pois.json';
    </script>

    <!-- Script -->
    <script src="../assets/js/menu.js"></script>
    <script src="../assets/js/leaflet.js"></script>
</body>
</html>
