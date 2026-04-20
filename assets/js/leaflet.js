/* ==========================================================================
 * デジタルリーフレット (OpenSeadragon)
 *
 * 主要機能:
 *   - 裏/表の2枚をタブで切替 (各面に独立した OpenSeadragon ビューアを保持)
 *   - ミニマップ (navigator プラグインの組み込み機能)
 *   - 検索 → ピン表示 (POI ズーム)
 *   - ズームイン/アウト/ホーム/フルスクリーン ボタン
 *   - レスポンシブ対応 (ウィンドウリサイズで自動更新)
 *   - POI データは外部 JSON (assets/data/leaflet_pois.json) から読み込み
 *
 * ピン (POI) データ形式 (JSON):
 * ------------------------------------------------
 *   {
 *     "omote": [
 *       {
 *         "id": "stage",             // 一意な ID (URLハッシュ #omote:stage で遷移可)
 *         "title": "メインステージ",  // 表示名 (検索対象)
 *         "category": "ステージ",      // 任意カテゴリ (検索対象・表示)
 *         "description": "...",       // 詳細説明。一部の HTML 可 (a/br/strong/em 等)
 *         "keywords": ["...", ...],   // 追加の検索キーワード
 *         "x": 0.50,                  // 画像内 X 座標 (0.0 - 1.0 の相対値)
 *         "y": 0.35                   // 画像内 Y 座標 (0.0 - 1.0 の相対値)
 *       },
 *       ...
 *     ],
 *     "ura": [ ... ]
 *   }
 *
 *   座標は「画像の左上を(0,0)、右下を(1,1)」とする正規化座標系です。
 *   実装上は OpenSeadragon の viewport 座標 (画像のアスペクト比を考慮) に
 *   自動で変換し、OSD オーバーレイとしてピンを配置します。
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
        poisUrl: window.LEAFLET_CONFIG?.poisUrl || '../assets/data/leaflet_pois.json',
        // ズーム下限倍率: 初期表示 (home) の 0.75 倍 = 25% 小さい状態までしか縮小不可
        // (= 表示面積は home の 56% 程度が下限)
        minZoomHomeRatio: 0.75,
        osdOptions: {
            prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/',
            showNavigationControl: false, // 独自コントロールを使用
            animationTime: 0.6,
            blendTime: 0.1,
            constrainDuringPan: true,
            maxZoomPixelRatio: 3,
            // minZoomImageRatio は後段で動的に設定 (home ズームの 0.75 倍を下限にするため)
            minZoomImageRatio: 0.5,
            visibilityRatio: 0.7,
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

    // ===== 状態 =====
    const state = {
        currentSide: 'omote',
        viewers: { omote: null, ura: null },
        pinOverlays: { omote: [], ura: [] },
        activePoi: null,
        pois: { omote: [], ura: [] }
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

    /**
     * home ズームを基準に minZoom を動的に設定する
     * home は「画像全体がビューに収まる」ズームレベル。
     * その 0.75 倍 = これ以上縮小不可 (= 25% 以上縮小させない)
     */
    function applyMinZoomConstraint(viewer) {
        try {
            const homeZoom = viewer.viewport.getHomeZoom();
            if (homeZoom && isFinite(homeZoom)) {
                const minZoom = homeZoom * CONFIG.minZoomHomeRatio;
                viewer.viewport.minZoomLevel = minZoom;
                // もし現在のズームが下限を下回っていれば補正
                if (viewer.viewport.getZoom() < minZoom) {
                    viewer.viewport.zoomTo(minZoom, null, true);
                }
            }
        } catch (e) { /* noop */ }
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
            navigatorId: navEl.id + '_inner'
        });

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
            applyMinZoomConstraint(viewer);

            const refit = () => {
                try {
                    viewer.forceRedraw();
                    viewer.viewport.goHome(true);
                    applyMinZoomConstraint(viewer);
                    viewer.viewport.applyConstraints(true);
                    if (viewer.navigator && viewer.navigator.updateSize) {
                        viewer.navigator.updateSize();
                        viewer.navigator.update(viewer.viewport);
                    }
                } catch (e) { /* noop */ }
            };
            requestAnimationFrame(() => requestAnimationFrame(refit));
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

        viewer.addHandler('resize', () => {
            if (viewer.navigator && viewer.navigator.updateSize) {
                viewer.navigator.updateSize();
            }
            // リサイズ後も下限ズームを再計算 (home zoom がビュー幅で変化するため)
            applyMinZoomConstraint(viewer);
        });

        // ズームが下限より小さくなろうとしていたら制限
        viewer.addHandler('zoom', (ev) => {
            const vp = viewer.viewport;
            if (!vp.minZoomLevel) return;
            if (ev.zoom < vp.minZoomLevel * 0.999) {
                // applyConstraints が動作するのを待つ
                // (constrainDuringPan 等の経路で補正される)
            }
        });

        return viewer;
    }

    // ===== ピン描画 =====
    function renderPins(side) {
        const viewer = state.viewers[side];
        if (!viewer) return;

        // 既存のオーバーレイを除去
        state.pinOverlays[side].forEach(({ el }) => {
            try { viewer.removeOverlay(el); } catch (e) { /* noop */ }
        });
        state.pinOverlays[side] = [];

        const pois = state.pois[side] || [];
        pois.forEach((poi) => {
            const pinEl = document.createElement('button');
            pinEl.type = 'button';
            pinEl.className = 'leaflet_pin';
            pinEl.dataset.poiId = poi.id;
            pinEl.setAttribute('aria-label', poi.title);
            pinEl.innerHTML = `
                <span class="pin_dot" aria-hidden="true"></span>
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

            // pointerdown ベースでクリック扱い (OSD の canvas-click と競合回避)
            // click を使うと、一部の PC 環境で viewer のジェスチャ層に吸われて発火しない
            // ことがあるため、pointerup / touchend / click の複数経路で拾う。
            const handleActivate = (e) => {
                e.stopPropagation();
                e.preventDefault();
                focusPoi(side, poi);
            };
            pinEl.addEventListener('click', handleActivate);
            pinEl.addEventListener('pointerup', (e) => {
                // 主ボタンのみ
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                handleActivate(e);
            });
            // OSD にドラッグとして吸われないよう、pointerdown で伝播を止める
            pinEl.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
            });
            // キーボード対応 (Enter/Space)
            pinEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleActivate(e);
                }
            });

            // OpenSeadragon オーバーレイは正規化画像座標 → viewport 座標へ
            const vpPoint = normalizedToViewport(viewer, poi.x, poi.y);
            if (!vpPoint) return;

            // placement: CENTER でオーバーレイ要素の中心を正規化座標へアンカーする
            // 要素側は CSS で中心が正しい位置 (ピン先端/ドット中心) に来るよう設計する
            viewer.addOverlay({
                element: pinEl,
                location: vpPoint,
                placement: OpenSeadragon.Placement.CENTER,
                checkResize: false
            });

            state.pinOverlays[side].push({ el: pinEl, poi });
        });
    }

    // ===== ピン → 詳細ポップアップ =====
    function focusPoi(side, poi) {
        const viewer = state.viewers[side];
        if (!viewer) return;

        // タブ切替
        if (state.currentSide !== side) {
            switchTab(side);
            // 切替後にフォーカス
            setTimeout(() => focusPoi(side, poi), 560);
            return;
        }

        // ピンに active 付与 (他は解除)
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
    // description 内で許可するタグ・属性のホワイトリスト
    const ALLOWED_TAGS = {
        'A': ['href', 'target', 'rel', 'title'],
        'BR': [],
        'STRONG': [], 'B': [],
        'EM': [], 'I': [],
        'U': [],
        'SPAN': ['class'],
        'SMALL': [],
        'MARK': []
    };

    /**
     * description の安全な HTML サニタイズ (ホワイトリスト方式)。
     * DOMParser で解析し、許可タグ以外はテキストとして除去。
     */
    function sanitizeDescription(html) {
        if (html == null) return '';
        const doc = new DOMParser().parseFromString('<body>' + String(html) + '</body>', 'text/html');
        const root = doc.body;

        const walk = (node) => {
            // 子を配列コピーしてから処理 (走査中に DOM を変えるため)
            Array.from(node.childNodes).forEach((child) => {
                if (child.nodeType === 1 /* ELEMENT */) {
                    const tag = child.tagName;
                    if (!ALLOWED_TAGS[tag]) {
                        // タグ不許可: 中身を残してタグ自体を unwrap
                        while (child.firstChild) node.insertBefore(child.firstChild, child);
                        node.removeChild(child);
                        return;
                    }
                    // 属性フィルタ
                    const allowedAttrs = ALLOWED_TAGS[tag];
                    Array.from(child.attributes).forEach((attr) => {
                        if (!allowedAttrs.includes(attr.name)) {
                            child.removeAttribute(attr.name);
                        }
                    });
                    // href のセキュリティチェック
                    if (tag === 'A') {
                        const href = child.getAttribute('href') || '';
                        // javascript: / data: スキームは禁止
                        if (/^\s*(javascript|data|vbscript):/i.test(href)) {
                            child.removeAttribute('href');
                        } else {
                            // 外部リンクっぽければ安全属性を付与
                            const isExternal = /^(https?:|\/\/)/i.test(href);
                            if (isExternal && !child.getAttribute('target')) {
                                child.setAttribute('target', '_blank');
                            }
                            // 常に rel noopener を付ける (target=_blank 付きの場合のセキュリティ対策)
                            const target = child.getAttribute('target');
                            if (target === '_blank') {
                                child.setAttribute('rel', 'noopener noreferrer');
                            }
                        }
                    }
                    walk(child);
                } else if (child.nodeType === 8 /* COMMENT */) {
                    node.removeChild(child);
                }
            });
        };
        walk(root);
        return root.innerHTML;
    }

    function showPopup(poi) {
        const popup = $('#leaflet_popup');
        if (!popup) return;
        const catEl = $('#popup_category');
        catEl.textContent = poi.category || '';
        catEl.style.display = poi.category ? 'inline-block' : 'none';
        $('#popup_title').textContent = poi.title || '';
        // description はサニタイズ済み HTML として挿入
        $('#popup_desc').innerHTML = sanitizeDescription(poi.description || '');
        popup.classList.add('is-open');
    }

    function hidePopup() {
        const popup = $('#leaflet_popup');
        if (!popup) return;
        popup.classList.remove('is-open');
        Object.values(state.pinOverlays).forEach((arr) => {
            arr.forEach(({ el }) => el.classList.remove('is-active'));
        });
        state.activePoi = null;
    }

    // ===== タブ切替 =====
    function switchTab(side) {
        if (side === state.currentSide) return;

        const prevSide = state.currentSide;
        state.currentSide = side;

        $$('.leaflet_tab').forEach((tab) => {
            tab.classList.toggle('is-active', tab.dataset.side === side);
            tab.setAttribute('aria-selected', tab.dataset.side === side ? 'true' : 'false');
        });

        // モダンなフリップアニメーション
        //   旧面: is-exiting を付けてフェード + 後方へ回転
        //   新面: is-entering で前方から現れる
        const wraps = {
            prev: document.querySelector(`.leaflet_viewer_wrap[data-side="${prevSide}"]`),
            next: document.querySelector(`.leaflet_viewer_wrap[data-side="${side}"]`)
        };

        if (wraps.next) {
            wraps.next.hidden = false;
            wraps.next.classList.remove('is-exiting');
            wraps.next.classList.add('is-entering');
        }
        if (wraps.prev) {
            wraps.prev.classList.remove('is-entering');
            wraps.prev.classList.add('is-exiting');
        }

        hidePopup();

        const ANIM_MS = 520;
        setTimeout(() => {
            if (wraps.prev) {
                wraps.prev.hidden = true;
                wraps.prev.classList.remove('is-exiting');
            }
            if (wraps.next) {
                wraps.next.classList.remove('is-entering');
            }
            // ビューアサイズ更新 (非表示 → 表示に切替直後は再計算が必要)
            const v = state.viewers[side];
            if (v) {
                try {
                    v.forceRedraw();
                    v.viewport.goHome(true);
                    applyMinZoomConstraint(v);
                    if (v.navigator && v.navigator.updateSize) {
                        v.navigator.updateSize();
                    }
                } catch (e) { /* noop */ }
            }
        }, ANIM_MS);
    }

    // ===== 検索 =====
    function buildSearchIndex() {
        const index = [];
        ['omote', 'ura'].forEach((side) => {
            const pois = state.pois[side] || [];
            pois.forEach((poi) => {
                const haystack = [
                    poi.title || '',
                    poi.category || '',
                    // 検索用にはタグ除去した description を使う
                    stripTags(poi.description || ''),
                    ...(poi.keywords || [])
                ].join(' ').toLowerCase();
                index.push({ side, poi, haystack });
            });
        });
        return index;
    }

    function stripTags(html) {
        return String(html).replace(/<[^>]*>/g, ' ');
    }

    let searchIndex = [];
    let suggestFocusIdx = -1;

    function runSearch(query) {
        const q = (query || '').trim().toLowerCase();
        if (!q) {
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
                            applyMinZoomConstraint(v);
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

        const pois = state.pois[side] || [];
        const poi = pois.find((p) => p.id === poiId);
        if (poi) focusPoi(side, poi);
    }

    // ===== POI データの読み込み =====
    async function loadPois() {
        // 互換性: window.LEAFLET_POIS が直接定義されていればそれを優先
        if (window.LEAFLET_POIS && (window.LEAFLET_POIS.omote || window.LEAFLET_POIS.ura)) {
            state.pois.omote = window.LEAFLET_POIS.omote || [];
            state.pois.ura = window.LEAFLET_POIS.ura || [];
            return;
        }
        try {
            const res = await fetch(CONFIG.poisUrl, { cache: 'no-cache' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            state.pois.omote = Array.isArray(data.omote) ? data.omote : [];
            state.pois.ura = Array.isArray(data.ura) ? data.ura : [];
            // 互換用にグローバルにもコピー
            window.LEAFLET_POIS = { omote: state.pois.omote, ura: state.pois.ura };
        } catch (e) {
            console.error('[Leaflet] POI JSON 読み込み失敗:', e);
            state.pois.omote = [];
            state.pois.ura = [];
        }
    }

    // ===== 初期化 =====
    async function init() {
        if (typeof OpenSeadragon === 'undefined') {
            console.error('[Leaflet] OpenSeadragon が読み込まれていません');
            return;
        }

        // 1) POI データ読込 (外部 JSON)
        await loadPois();

        // 2) ビューア生成
        try {
            state.viewers.omote = createViewer('omote');
            state.viewers.ura = createViewer('ura');
        } catch (e) {
            console.error('[Leaflet] Viewer init failed:', e);
            return;
        }

        // 3) 検索インデックス構築 & イベント配線
        searchIndex = buildSearchIndex();
        bindEvents();

        // URL ハッシュ処理 (ビューア初期化を待つ)
        setTimeout(handleHash, 900);
        window.addEventListener('hashchange', handleHash);
    }

    // OpenSeadragon は defer 読み込みのため、DOMContentLoaded を待つ必要がある
    function start() {
        // OSD が未ロードなら少し待つ
        if (typeof OpenSeadragon === 'undefined') {
            const check = () => {
                if (typeof OpenSeadragon !== 'undefined') {
                    init();
                } else {
                    setTimeout(check, 50);
                }
            };
            check();
        } else {
            init();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    // 公開API (動的にPOIを追加できるように)
    window.LeafletViewer = {
        refreshPins: (side) => {
            if (side) renderPins(side);
            else { renderPins('omote'); renderPins('ura'); }
            searchIndex = buildSearchIndex();
        },
        reloadPois: async () => {
            await loadPois();
            renderPins('omote');
            renderPins('ura');
            searchIndex = buildSearchIndex();
        },
        focusPoi,
        switchTab,
        getState: () => state
    };
})();
