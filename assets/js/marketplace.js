// Cafe / Goods marketplace renderer
// - Card rendering with skeleton loader
// - Search / category / cashless / sort filters
// - Hero stats (total, categories, cashless count)
// - Modal detail view with variations support
(function() {
    'use strict';

    var main = document.querySelector('.market_main');
    if (!main) return;

    var dataUrl = main.dataset.dataUrl;
    var allItems = [];
    var state = {
        category: 'all',
        cashless: 'all',
        search: '',
        sort: 'default'
    };

    var grid             = document.getElementById('market_grid');
    var search           = document.getElementById('market_search');
    var searchClear      = document.getElementById('market_search_clear');
    var categories       = document.getElementById('market_categories');
    var count            = document.getElementById('market_count');
    var cashlessButtons  = document.querySelectorAll('[data-cashless]');
    var overlay          = document.getElementById('market_modal_overlay');
    var closeBtn         = document.getElementById('market_modal_close');
    var sortSelect       = document.getElementById('market_sort');
    var resetBtn         = document.getElementById('market_reset_btn');
    var heroStats        = document.getElementById('market_hero_stats');

    /* ---------- Helpers ---------- */
    function esc(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function yen(price) {
        return '<span class="yen">¥</span>' + Number(price || 0).toLocaleString('ja-JP');
    }
    function plainYen(price) {
        return '¥' + Number(price || 0).toLocaleString('ja-JP');
    }
    function getDisplayPrice(item) {
        if (item.variations && item.variations.length > 0) {
            var prices = item.variations.map(function(v){ return Number(v.price) || 0; });
            var min = Math.min.apply(null, prices);
            var max = Math.max.apply(null, prices);
            return { min: min, max: max, html: yen(min) + (min === max ? '' : '<span class="suffix">〜</span>') };
        }
        return { min: Number(item.price) || 0, max: Number(item.price) || 0, html: yen(item.price) };
    }
    function getDisplayStock(item) {
        if (item.variations && item.variations.length > 0) {
            return item.variations.reduce(function(s, v){ return s + (Number(v.stock) || 0); }, 0);
        }
        return Number(item.stock) || 0;
    }
    function stockClass(stock) {
        if (stock <= 0) return 'out';
        if (stock < 20) return 'low';
        return '';
    }
    function stockLabel(stock) {
        if (stock <= 0) return '完売';
        if (stock < 20) return '残り僅か';
        return '在庫 ' + stock;
    }

    /* ---------- Skeleton ---------- */
    function renderSkeleton() {
        var html = '';
        for (var i = 0; i < 6; i++) {
            html += '<div class="market_skeleton" aria-hidden="true">' +
                    '<div class="market_skeleton_img"></div>' +
                    '<div class="market_skeleton_body">' +
                    '<div class="market_skeleton_line"></div>' +
                    '<div class="market_skeleton_line"></div>' +
                    '<div class="market_skeleton_line"></div>' +
                    '<div class="market_skeleton_line"></div>' +
                    '</div></div>';
        }
        grid.innerHTML = html;
    }

    /* ---------- Hero stats ---------- */
    function renderHeroStats() {
        if (!heroStats) return;
        var total = allItems.length;
        var cats  = new Set(allItems.map(function(i){ return i.category; })).size;
        var cl    = allItems.filter(function(i){ return i.cashless; }).length;
        animateNum(heroStats.querySelector('[data-stat="total"]'), total);
        animateNum(heroStats.querySelector('[data-stat="cats"]'),  cats);
        animateNum(heroStats.querySelector('[data-stat="cashless"]'), cl);
    }

    function animateNum(el, target) {
        if (!el) return;
        var start = 0;
        var duration = 700;
        var t0 = performance.now();
        function tick(now) {
            var p = Math.min(1, (now - t0) / duration);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(start + (target - start) * eased);
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    /* ---------- Category buttons ---------- */
    function renderCategoryButtons() {
        var unique = ['all'].concat(Array.from(new Set(allItems.map(function(i){ return i.category; }))));
        categories.innerHTML = unique.map(function(cat) {
            var label = cat === 'all' ? 'すべて' : esc(cat);
            return '<button class="market_chip' + (cat === 'all' ? ' active' : '') +
                   '" data-category="' + esc(cat) + '" type="button">' + label + '</button>';
        }).join('');
    }

    /* ---------- Filtering & sorting ---------- */
    function processedItems() {
        var items = allItems.filter(function(item) {
            if (state.category !== 'all' && item.category !== state.category) return false;
            if (state.cashless !== 'all' && String(item.cashless) !== state.cashless) return false;
            if (state.search) {
                var q = state.search.toLowerCase();
                var hay = [item.title, item.description, item.seller, item.category];
                if (item.variations) {
                    item.variations.forEach(function(v){ hay.push(v.name); });
                }
                if (hay.join(' ').toLowerCase().indexOf(q) === -1) return false;
            }
            return true;
        });

        if (state.sort === 'price_asc') {
            items.sort(function(a, b) { return getDisplayPrice(a).min - getDisplayPrice(b).min; });
        } else if (state.sort === 'price_desc') {
            items.sort(function(a, b) { return getDisplayPrice(b).max - getDisplayPrice(a).max; });
        } else if (state.sort === 'name') {
            items.sort(function(a, b) { return String(a.title).localeCompare(String(b.title), 'ja'); });
        }
        return items;
    }

    /* ---------- Card render ---------- */
    function renderCards() {
        var items = processedItems();

        // Reset button visibility
        var hasFilter = (state.category !== 'all' || state.cashless !== 'all' ||
                         state.search !== ''     || state.sort !== 'default');
        if (resetBtn) resetBtn.hidden = !hasFilter;

        // Counter
        if (items.length === allItems.length) {
            count.innerHTML = '全 <strong>' + items.length + '</strong> 件';
        } else {
            count.innerHTML = '<strong>' + items.length + '</strong> / ' + allItems.length + ' 件';
        }

        if (!items.length) {
            grid.innerHTML =
                '<div class="market_empty">' +
                '<svg class="market_empty_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
                '<p class="market_empty_title">該当する商品がありません</p>' +
                '<p class="market_empty_text">検索条件やカテゴリを変えてもう一度お試しください。</p>' +
                '</div>';
            grid.removeAttribute('aria-busy');
            return;
        }

        grid.innerHTML = items.map(function(item, idx) {
            var price = getDisplayPrice(item);
            var stock = getDisplayStock(item);
            var sCls  = stockClass(stock);
            var sLbl  = stockLabel(stock);
            var hasVariations = item.variations && item.variations.length > 0;
            var variationTag  = hasVariations
                ? '<span class="market_variation_tag">全' + item.variations.length + '種</span>'
                : '';
            var payTag = item.cashless
                ? '<span class="market_pay ok">キャッシュレス可</span>'
                : '<span class="market_pay cash">現金のみ</span>';
            var delay = Math.min(idx * 0.04, 0.4);

            return '<article class="market_card" tabindex="0" role="button" data-id="' + esc(item.id) +
                   '" style="animation-delay:' + delay + 's" aria-label="' + esc(item.title) + 'の詳細を見る">' +
                '<div class="market_img_wrap">' +
                  '<span class="market_card_badge">' + esc(item.category) + '</span>' +
                  '<span class="market_card_stock ' + sCls + '">' + esc(sLbl) + '</span>' +
                  '<img src="' + esc(item.photo) + '" alt="' + esc(item.title) + '" loading="lazy" decoding="async">' +
                '</div>' +
                '<div class="market_card_body">' +
                  '<h2 class="market_card_title">' + esc(item.title) + '</h2>' +
                  '<p class="market_card_desc">' + esc(item.description || '') + '</p>' +
                  '<span class="market_card_seller">' +
                    '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
                    esc(item.seller) +
                  '</span>' +
                  '<div class="market_card_footer">' +
                    '<span class="market_card_price">' + price.html + '</span>' +
                    '<div class="market_card_tags">' + variationTag + payTag + '</div>' +
                  '</div>' +
                '</div>' +
            '</article>';
        }).join('');

        grid.removeAttribute('aria-busy');
    }

    /* ---------- Modal ---------- */
    function openModal(item) {
        var img = document.getElementById('market_modal_img');
        img.src = item.photo;
        img.alt = item.title;
        document.getElementById('market_modal_category').textContent = item.category;
        document.getElementById('market_modal_title').textContent    = item.title;
        document.getElementById('market_modal_desc').textContent     = item.description || '';
        document.getElementById('market_modal_seller').textContent   = item.seller;
        document.getElementById('market_modal_cashless').textContent = item.cashless ? 'キャッシュレス対応' : '現金のみ';

        var priceWrap = document.getElementById('market_modal_price_wrap');
        var stockWrap = document.getElementById('market_modal_stock_wrap');
        var variationsContainer = document.getElementById('market_modal_variations');

        if (item.variations && item.variations.length > 0) {
            if (priceWrap) priceWrap.style.display = 'none';
            if (stockWrap) stockWrap.style.display = 'none';

            var rows = item.variations.map(function(v) {
                return '<tr>' +
                  '<td>' + esc(v.name) + '</td>' +
                  '<td class="var_price">' + plainYen(v.price) + '</td>' +
                  '<td>' + esc(stockLabel(Number(v.stock) || 0)) + '</td>' +
                '</tr>';
            }).join('');

            variationsContainer.innerHTML =
                '<table class="market_modal_variations_table">' +
                  '<thead><tr><th>種類</th><th>金額</th><th>在庫</th></tr></thead>' +
                  '<tbody>' + rows + '</tbody>' +
                '</table>';
            variationsContainer.style.display = 'block';
        } else {
            if (priceWrap) priceWrap.style.display = '';
            if (stockWrap) stockWrap.style.display = '';
            document.getElementById('market_modal_price').innerHTML = plainYen(item.price);
            document.getElementById('market_modal_stock').textContent = stockLabel(Number(item.stock) || 0);

            variationsContainer.innerHTML = '';
            variationsContainer.style.display = 'none';
        }

        overlay.classList.add('active');
        document.body.classList.add('market_modal_open');
        closeBtn.focus();
    }

    function closeModal() {
        overlay.classList.remove('active');
        document.body.classList.remove('market_modal_open');
    }

    /* ---------- Events ---------- */
    categories.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-category]');
        if (!btn) return;
        state.category = btn.dataset.category;
        categories.querySelectorAll('.market_chip').forEach(function(b) {
            b.classList.toggle('active', b === btn);
        });
        renderCards();
    });

    cashlessButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            state.cashless = btn.dataset.cashless;
            cashlessButtons.forEach(function(b) {
                b.classList.toggle('active', b === btn);
            });
            renderCards();
        });
    });

    if (search) {
        search.addEventListener('input', function() {
            state.search = search.value.trim();
            if (searchClear) searchClear.classList.toggle('visible', state.search.length > 0);
            renderCards();
        });
    }

    if (searchClear) {
        searchClear.addEventListener('click', function() {
            search.value = '';
            state.search = '';
            searchClear.classList.remove('visible');
            search.focus();
            renderCards();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            state.sort = sortSelect.value;
            renderCards();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            state.category = 'all';
            state.cashless = 'all';
            state.search   = '';
            state.sort     = 'default';
            if (search) search.value = '';
            if (searchClear) searchClear.classList.remove('visible');
            if (sortSelect) sortSelect.value = 'default';
            categories.querySelectorAll('.market_chip').forEach(function(b) {
                b.classList.toggle('active', b.dataset.category === 'all');
            });
            cashlessButtons.forEach(function(b) {
                b.classList.toggle('active', b.dataset.cashless === 'all');
            });
            renderCards();
        });
    }

    grid.addEventListener('click', function(e) {
        var card = e.target.closest('.market_card');
        if (!card) return;
        var item = allItems.find(function(i){ return i.id === card.dataset.id; });
        if (item) openModal(item);
    });

    grid.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var card = e.target.closest('.market_card');
        if (!card) return;
        e.preventDefault();
        var item = allItems.find(function(i){ return i.id === card.dataset.id; });
        if (item) openModal(item);
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
    });

    /* ---------- Init ---------- */
    renderSkeleton();

    fetch(dataUrl)
        .then(function(res) { return res.json(); })
        .then(function(data) {
            allItems = data;
            renderHeroStats();
            renderCategoryButtons();
            renderCards();
        })
        .catch(function(err) {
            console.error('Failed to load market data:', err);
            grid.innerHTML =
                '<div class="market_empty">' +
                '<svg class="market_empty_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
                '<p class="market_empty_title">データの読み込みに失敗しました</p>' +
                '<p class="market_empty_text">ネットワーク接続をご確認の上、ページを再読み込みしてください。</p>' +
                '</div>';
            grid.removeAttribute('aria-busy');
        });
})();
