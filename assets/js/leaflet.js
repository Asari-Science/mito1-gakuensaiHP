/* ==========================================================================
 * デジタルリーフレット (OpenSeadragon)
 *
 * 主要機能:
 *   - 裏/表の2枚をタブで切替 (各面に独立した OpenSeadragon ビューアを保持)
 *   - ミニマップ (navigator プラグインの組み込み機能)
 *   - 検索 → ピン表示 (POI ズーム)
 *   - ズームイン/アウト/ホーム/フルスクリーン ボタン
 *   - レスポンシブ対応 (ウィンドウリサイズで自動更新)
 *
 * ピン (POI) データの定義方法:
 * ------------------------------------------------
 *   window.LEAFLET_POIS = {
 *     omote: [
 *       {
 *         id: "stage",           // 一意なID
 *         title: "メインステージ",  // 表示名 (検索対象)
 *         category: "ステージ",    // 任意カテゴリ (検索対象・表示)
 *         description: "...",     // 詳細説明
 *         keywords: ["...", ...], // 追加の検索キーワード
 *         x: 0.50,               // 画像内 X 座標 (0.0 - 1.0 の相対値)
 *         y: 0.35                // 画像内 Y 座標 (0.0 - 1.0 の相対値)
 *       },
 *       ...
 *     ],
 *     ura: [ ... ]
 *   };
 *
 *   座標は「画像の左上を(0,0)、右下を(1,1)」とする正規化座標系です。
 *   実装上は OpenSeadragon の viewport 座標 (画像のアスペクト比を考慮) に
 *   自動で変換します。
 * ========================================================================== */

(function () {
    'use strict';

    // ===== 設定 =====
    const CONFIG = {
        sources: {
            omote: {
                type: 'image',
                url: window.LEAFLET_CONFIG?.omoteUrl || '../materials/leaflet/78th_leaflet_omote.webp'
            },
            ura: {
                type: 'image',
                url: window.LEAFLET_CONFIG?.uraUrl || '../materials/leaflet/78th_leaflet_ura.webp'
            }
        },
        osdOptions: {
            prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/',
            showNavigationControl: false, // 独自コントロールを使用
            animationTime: 0.6,
            blendTime: 0.1,
            constrainDuringPan: true,
            maxZoomPixelRatio: 3,
            minZoomImageRatio: 0.1, // 画像サイズ以上に縮小できるように
            visibilityRatio: 0.5, // 画像の端が画面の真ん中にくるくらいまでスクロール可能に
            defaultZoomLevel: 0,
            homeFillsViewer: false,
            gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true, scrollToZoom: true },
            gestureSettingsTouch: { pinchToZoom: true, flickEnabled: true, clickToZoom: false, dblClickToZoom: true },
            showNavigator: true,
            navigatorAutoResize: true,
            navigatorBackground: '#1a1207',
            navigatorBorderColor: 'rgba(246, 220, 159, 0.3)',
            navigatorDisplayRegionColor: '#f6dc9f'
        }
    };

    // ===== DOM 要素 =====
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    const viewerEls = {
        omote: $('#osd_omote'),
        ura: $('#osd_ura')
    };
    const navigatorEls = {
        omote: $('#minimap_omote'),
        ura: $('#minimap_ura')
    };
    const loaderEls = {
        omote: $('#loader_omote'),
        ura: $('#loader_ura')
    };
    const pinLayerEls = {
        omote: $('#pin_layer_omote'),
        ura: $('#pin_layer_ura')
    };

    // ===== 状態 =====
    const state = {
        currentSide: 'omote',
        viewers: { omote: null, ura: null },
        pinOverlays: { omote: [], ura: [] },
        activePoi: null
    };

    // ===== ユーティリティ =====
    function hideLoader(side) {
        const el = loaderEls[side];
        if (!el) return;
        el.classList.add('is-hidden');
        setTimeout(() => { el.style.display = 'none'; }, 400);
    }

    /**
     * 正規化 (x, y) ∈ [0,1] を OpenSeadragon の viewport 座標に変換する
     * viewport 座標系: 画像の幅 = 1.0, 高さ = (高さ/幅)
     */
    function normalizedToViewport(viewer, xNorm, yNorm) {
        const tiledImage = viewer.world.getItemAt(0);
        if (!tiledImage) return null;
        const size = tiledImage.getContentSize();
        const imagePoint = new OpenSeadragon.Point(size.x * xNorm, size.y * yNorm);
        return tiledImage.imageToViewportCoordinates(imagePoint);
    }

    // ===== ビューア初期化 =====
    function createViewer(side) {
        const el = viewerEls[side];
        const navEl = navigatorEls[side];

        const viewer = OpenSeadragon({
            ...CONFIG.osdOptions,
            element: el,
            tileSources: CONFIG.sources[side],
            navigatorPosition: 'ABSOLUTE',
            navigatorTop: '0px',
            navigatorLeft: '0px',
            navigatorWidth: '100%',
            navigatorHeight: '100%',
            // 外部DOMへナビゲーターを描画
            navigatorId: navEl.id + '_inner'
        });

        // ナビゲーター要素を自前の minimap コンテナへ移動
        viewer.addHandler('open', () => {
            if (viewer.navigator && viewer.navigator.element && viewer.navigator.element.parentNode !== navEl) {
                try {
                    navEl.appendChild(viewer.navigator.element);
                    const navEle = viewer.navigator.element;
                    navEle.style.position = 'absolute';
                    navEle.style.top = '0';
                    navEle.style.left = '0';
                    navEle.style.right = '0';
                    navEle.style.bottom = '0';
                    navEle.style.width = '100%';
                    navEle.style.height = '100%';
                    navEle.style.border = 'none';
                    navEle.style.margin = '0';
                    navEle.style.background = 'transparent';
                    if (viewer.navigator.update) {
                        viewer.navigator.updateSize();
                        viewer.navigator.update(viewer.viewport);
                    }
                } catch (e) {
                    console.warn('Navigator relocation failed:', e);
                }
            }

            hideLoader(side);
            renderPins(side);

            // ビューアのサイズが初期化時に 0 だった場合に備えて
            // レイアウト確定後に goHome を再実行 (特にモバイル/遅延レンダリング対策)
            const refit = () => {
                try {
                    viewer.forceRedraw();
                    viewer.viewport.goHome(true);
                    viewer.viewport.applyConstraints(true);
                    if (viewer.navigator && viewer.navigator.updateSize) {
                        viewer.navigator.updateSize();
                        viewer.navigator.update(viewer.viewport);
                    }
                } catch (e) { /* noop */ }
            };
            requestAnimationFrame(() => requestAnimationFrame(refit));
            // さらに安全策として少し遅延してもう一度
            setTimeout(refit, 300);
            setTimeout(refit, 800);
        });

        viewer.addHandler('tile-load-failed', (ev) => {
            console.error('[OpenSeadragon] tile load failed:', ev);
        });

        viewer.addHandler('open-failed', (ev) => {
            console.error('[OpenSeadragon] open failed:', ev);
            const loader = loaderEls[side];
            if (loader) {
                loader.innerHTML = '<div style="color:#f6dc9f; text-align:center; padding:20px;">画像の読み込みに失敗しました。<br>ネットワーク接続をご確認ください。</div>';
            }
        });

        // ビューア領域更新時にピン座標も更新
        viewer.addHandler('update-viewport', () => updatePinPositions(side));
        viewer.addHandler('animation', () => updatePinPositions(side));
        viewer.addHandler('resize', () => {
            updatePinPositions(side);
            if (viewer.navigator && viewer.navigator.updateSize) {
                viewer.navigator.updateSize();
            }
        });

        return viewer;
    }

    // ===== ピン描画 =====
    function renderPins(side) {
        const viewer = state.viewers[side];
        const layer = pinLayerEls[side];
        if (!viewer || !layer) return;

        // クリア
        layer.innerHTML = '';
        state.pinOverlays[side] = [];

        const pois = (window.LEAFLET_POIS && window.LEAFLET_POIS[side]) || [];
        pois.forEach((poi) => {
            const pinEl = document.createElement('button');
            pinEl.type = 'button';
            pinEl.className = 'leaflet_pin';
            pinEl.dataset.poiId = poi.id;
            pinEl.setAttribute('aria-label', poi.title);
            pinEl.innerHTML = `
                <span class="pin_pulse" aria-hidden="true"></span>
                <svg class="pin_marker" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <defs>
                        <linearGradient id="pin_grad_${side}_${poi.id}" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#f6dc9f"/>
                            <stop offset="100%" stop-color="#dab584"/>
                        </linearGradient>
                    </defs>
                    <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z"
                        fill="url(#pin_grad_${side}_${poi.id})" stroke="#1a1207" stroke-width="1.5"/>
                    <circle cx="14" cy="14" r="5" fill="#1a1207"/>
                </svg>
                <span class="pin_label">${escapeHtml(poi.title)}</span>
            `;

            pinEl.addEventListener('click', (e) => {
                e.stopPropagation();
                focusPoi(side, poi);
            });

            // OpenSeadragon オーバーレイは正規化画像座標 → viewport 座標へ
            const vpPoint = normalizedToViewport(viewer, poi.x, poi.y);
            if (!vpPoint) return;

            viewer.addOverlay({
                element: pinEl,
                location: vpPoint,
                placement: OpenSeadragon.Placement.BOTTOM,
                checkResize: false
            });

            state.pinOverlays[side].push({ el: pinEl, poi });
        });
    }

    function updatePinPositions(side) {
        // OpenSeadragon が自動追従するので個別処理は不要
        // (必要ならここでオーバーレイの再計算を行う)
    }

    // ===== ピン → 詳細ポップアップ =====
    function focusPoi(side, poi) {
        const viewer = state.viewers[side];
        if (!viewer) return;

        // タブ切替
        if (state.currentSide !== side) {
            switchTab(side);
            // 切替後にフォーカス
            setTimeout(() => focusPoi(side, poi), 520);
            return;
        }

        // ピンにactive付与
        state.pinOverlays[side].forEach(({ el, poi: p }) => {
            if (p.id === poi.id) el.classList.add('is-active');
            else el.classList.remove('is-active');
        });
        state.activePoi = poi;

        // ビューアをピン座標へアニメーションズーム
        const vpPoint = normalizedToViewport(viewer, poi.x, poi.y);
        if (vpPoint) {
            const targetZoom = Math.max(viewer.viewport.getZoom() * 1, 2.5);
            viewer.viewport.zoomTo(targetZoom, vpPoint, false);
            viewer.viewport.panTo(vpPoint, false);
        }

        showPopup(poi);
    }

    // ===== ポップアップ =====
    function showPopup(poi) {
        const popup = $('#leaflet_popup');
        if (!popup) return;
        $('#popup_category').textContent = poi.category || '';
        $('#popup_category').style.display = poi.category ? 'inline-block' : 'none';
        $('#popup_title').textContent = poi.title || '';
        $('#popup_desc').textContent = poi.description || '';
        popup.classList.add('is-open');
    }

    function hidePopup() {
        const popup = $('#leaflet_popup');
        if (!popup) return;
        popup.classList.remove('is-open');
        // アクティブピンも解除
        Object.values(state.pinOverlays).forEach((arr) => {
            arr.forEach(({ el }) => el.classList.remove('is-active'));
        });
        state.activePoi = null;
    }

    // ===== タブ切替 =====
    function switchTab(side) {
        if (side === state.currentSide) return;

        state.currentSide = side;

        $$('.leaflet_tab').forEach((tab) => {
            tab.classList.toggle('is-active', tab.dataset.side === side);
            tab.setAttribute('aria-selected', tab.dataset.side === side ? 'true' : 'false');
        });

        // ビューア表示切替
        ['omote', 'ura'].forEach((s) => {
            const wrap = document.querySelector(`.leaflet_viewer_wrap[data-side="${s}"]`);
            if (wrap) {
                wrap.hidden = (s !== side);
            }
        });

        hidePopup();

        // ビューアサイズ更新 (非表示から表示に切り替えた直後は再計算が必要)
        const v = state.viewers[side];
        if (v) {
            requestAnimationFrame(() => {
                try {
                    if (v.viewport) {
                        // resize イベントを手動発火
                        v.forceRedraw();
                        v.viewport.goHome(true);
                    }
                    if (v.navigator && v.navigator.updateSize) {
                        v.navigator.updateSize();
                    }
                } catch (e) { /* noop */ }
            });
        }
    }

    // ===== 検索 =====
    function buildSearchIndex() {
        const index = [];
        ['omote', 'ura'].forEach((side) => {
            const pois = (window.LEAFLET_POIS && window.LEAFLET_POIS[side]) || [];
            pois.forEach((poi) => {
                const haystack = [
                    poi.title || '',
                    poi.category || '',
                    poi.description || '',
                    ...(poi.keywords || [])
                ].join(' ').toLowerCase();
                index.push({ side, poi, haystack });
            });
        });
        return index;
    }

    let searchIndex = [];
    let suggestFocusIdx = -1;

    function runSearch(query) {
        const q = (query || '').trim().toLowerCase();
        if (!q) {
            // クエリが空の場合はランダムにいくつかサジェスト (最大5件)
            return [...searchIndex].sort(() => 0.5 - Math.random()).slice(0, 5);
        }
        return searchIndex.filter((entry) => entry.haystack.includes(q)).slice(0, 20);
    }

    function renderSuggestions(results, query) {
        const box = $('#leaflet_search_suggest');
        if (!box) return;
        suggestFocusIdx = -1;

        if (results.length === 0) {
            if (!query) {
                box.classList.remove('is-open');
                return;
            }
            box.innerHTML = `<div class="leaflet_search_suggest_empty">「${escapeHtml(query)}」に一致するピンはありません</div>`;
            box.classList.add('is-open');
            return;
        }

        let html = '';
        if (!query) {
            html += '<div style="padding:10px 12px 6px; font-size:11px; color:rgba(246,220,159,0.5); font-weight:bold; letter-spacing:0.05em;">おすすめの場所</div>';
        }

        html += results.map((r, i) => `
            <div class="leaflet_search_suggest_item" data-idx="${i}" role="option">
                <span class="leaflet_search_suggest_side">${r.side === 'omote' ? '表' : '裏'}</span>
                <span class="leaflet_search_suggest_title">${highlightMatch(r.poi.title, query)}${r.poi.category ? ` <small style="opacity:.6;">/ ${escapeHtml(r.poi.category)}</small>` : ''}</span>
            </div>
        `).join('');

        box.innerHTML = html;
        box.classList.add('is-open');

        // クリック
        box.querySelectorAll('.leaflet_search_suggest_item').forEach((item) => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.dataset.idx, 10);
                const target = results[idx];
                if (target) {
                    focusPoi(target.side, target.poi);
                    box.classList.remove('is-open');
                    $('#leaflet_search_input').value = target.poi.title;
                    $('.leaflet_search').classList.add('has-text');
                }
            });
        });
    }

    function highlightMatch(text, query) {
        if (!text) return '';
        const safe = escapeHtml(text);
        if (!query) return safe;
        const qLower = query.toLowerCase();
        const lower = safe.toLowerCase();
        const idx = lower.indexOf(qLower);
        if (idx < 0) return safe;
        return safe.slice(0, idx) + '<mark style="background:rgba(246,220,159,.35);color:#f6dc9f;border-radius:3px;padding:0 2px;">' + safe.slice(idx, idx + query.length) + '</mark>' + safe.slice(idx + query.length);
    }

    function escapeHtml(s) {
        if (s == null) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ===== イベント配線 =====
    function bindEvents() {
        // タブ
        $$('.leaflet_tab').forEach((tab) => {
            tab.addEventListener('click', () => {
                switchTab(tab.dataset.side);
            });
        });

        // ズームコントロール
        $$('.leaflet_zoom_btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const v = state.viewers[state.currentSide];
                if (!v) return;
                const role = btn.dataset.role;
                if (role === 'zoom-in') v.viewport.zoomBy(1.4);
                if (role === 'zoom-out') v.viewport.zoomBy(0.7);
                if (role === 'home') v.viewport.goHome();
                v.viewport.applyConstraints();
            });
        });

        // ミニマップ表示切替
        const mmToggle = $('[data-role="minimap"]');
        if (mmToggle) {
            mmToggle.addEventListener('click', () => {
                const hidden = $$('.leaflet_minimap').some((el) => !el.classList.contains('is-hidden'));
                $$('.leaflet_minimap').forEach((el) => {
                    if (hidden) el.classList.add('is-hidden');
                    else el.classList.remove('is-hidden');
                });
                mmToggle.classList.toggle('is-active', !hidden);
            });
            mmToggle.classList.add('is-active');
        }

        // フルスクリーン
        const fsBtn = $('[data-role="fullscreen"]');
        if (fsBtn) {
            fsBtn.addEventListener('click', () => {
                const el = $('.leaflet_main');
                if (!document.fullscreenElement) {
                    (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen)?.call(el);
                } else {
                    (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen)?.call(document);
                }
            });
            document.addEventListener('fullscreenchange', () => {
                fsBtn.classList.toggle('is-active', !!document.fullscreenElement);
            });
        }

        // ポップアップ閉じる
        const popupClose = $('#popup_close');
        if (popupClose) popupClose.addEventListener('click', hidePopup);

        // ビューア背景クリックでポップアップ閉じる
        document.addEventListener('click', (e) => {
            const popup = $('#leaflet_popup');
            if (!popup || !popup.classList.contains('is-open')) return;
            if (e.target.closest('.leaflet_popup') || e.target.closest('.leaflet_pin') || e.target.closest('.leaflet_search_suggest')) return;
            // ビューア内クリック時も閉じる（ピン以外）
            if (e.target.closest('.leaflet_viewer_wrap')) {
                // OSDのドラッグ終了イベントと競合しないようにする
            }
        });

        // 検索
        const input = $('#leaflet_search_input');
        const clearBtn = $('#leaflet_search_clear');
        const wrap = $('.leaflet_search');
        const suggestBox = $('#leaflet_search_suggest');

        if (input) {
            input.addEventListener('input', (e) => {
                const q = e.target.value;
                wrap.classList.toggle('has-text', !!q);
                const results = runSearch(q);
                renderSuggestions(results, q);
            });

            input.addEventListener('keydown', (e) => {
                if (!suggestBox.classList.contains('is-open')) return;
                const items = suggestBox.querySelectorAll('.leaflet_search_suggest_item');
                if (!items.length) return;
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    suggestFocusIdx = (suggestFocusIdx + 1) % items.length;
                    updateSuggestFocus(items);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    suggestFocusIdx = (suggestFocusIdx - 1 + items.length) % items.length;
                    updateSuggestFocus(items);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const idx = suggestFocusIdx >= 0 ? suggestFocusIdx : 0;
                    items[idx]?.click();
                } else if (e.key === 'Escape') {
                    suggestBox.classList.remove('is-open');
                }
            });

            input.addEventListener('focus', () => {
                renderSuggestions(runSearch(input.value), input.value);
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                input.value = '';
                wrap.classList.remove('has-text');
                suggestBox.classList.remove('is-open');
                input.focus();
            });
        }

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.leaflet_search')) {
                suggestBox?.classList.remove('is-open');
            }
        });

        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === '1') switchTab('omote');
            if (e.key === '2') switchTab('ura');
            if (e.key === 'Escape') hidePopup();
            if (e.key === '/' || (e.ctrlKey && e.key === 'f')) {
                e.preventDefault();
                input?.focus();
            }
        });

        // リサイズ → ヒント非表示 & ビューア更新
        const hint = $('.leaflet_hint');
        setTimeout(() => hint?.classList.add('is-hidden'), 6000);

        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                ['omote', 'ura'].forEach((s) => {
                    const v = state.viewers[s];
                    if (v && v.viewport) {
                        try {
                            v.forceRedraw();
                            if (v.navigator && v.navigator.updateSize) v.navigator.updateSize();
                        } catch (e) { /* noop */ }
                    }
                });
            }, 150);
        });
    }

    function updateSuggestFocus(items) {
        items.forEach((item, i) => {
            item.classList.toggle('is-focused', i === suggestFocusIdx);
        });
    }

    // ===== ハッシュによるディープリンク (#omote:stage のような形式) =====
    function handleHash() {
        const hash = (location.hash || '').replace(/^#/, '');
        if (!hash) return;
        const [side, poiId] = hash.split(':');
        if (!['omote', 'ura'].includes(side)) return;
        if (!poiId) { switchTab(side); return; }

        const pois = (window.LEAFLET_POIS && window.LEAFLET_POIS[side]) || [];
        const poi = pois.find((p) => p.id === poiId);
        if (poi) focusPoi(side, poi);
    }

    // ===== 初期化 =====
    function init() {
        if (typeof OpenSeadragon === 'undefined') {
            console.error('[Leaflet] OpenSeadragon が読み込まれていません');
            return;
        }

        // POI 定義がなければ空に
        window.LEAFLET_POIS = window.LEAFLET_POIS || { omote: [], ura: [] };

        try {
            state.viewers.omote = createViewer('omote');
            state.viewers.ura = createViewer('ura');
        } catch (e) {
            console.error('[Leaflet] Viewer init failed:', e);
            return;
        }

        searchIndex = buildSearchIndex();

        bindEvents();

        // URLハッシュ処理
        setTimeout(handleHash, 800);
        window.addEventListener('hashchange', handleHash);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 公開API (動的にPOIを追加できるように)
    window.LeafletViewer = {
        refreshPins: (side) => {
            if (side) renderPins(side);
            else { renderPins('omote'); renderPins('ura'); }
            searchIndex = buildSearchIndex();
        },
        focusPoi,
        switchTab,
        getState: () => state
    };
})();
