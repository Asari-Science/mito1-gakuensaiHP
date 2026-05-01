// Cafe / Goods card renderer
(function() {
    'use strict';

    var main = document.querySelector('.market_main');
    if (!main) return;

    var dataUrl = main.dataset.dataUrl;
    var allItems = [];
    var currentCategory = 'all';
    var currentCashless = 'all';
    var currentSearch = '';

    var grid = document.getElementById('market_grid');
    var search = document.getElementById('market_search');
    var categories = document.getElementById('market_categories');
    var count = document.getElementById('market_count');
    var cashlessButtons = document.querySelectorAll('[data-cashless]');
    var overlay = document.getElementById('market_modal_overlay');
    var closeBtn = document.getElementById('market_modal_close');

    function esc(str) {
        return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function yen(price) {
        return '¥' + Number(price || 0).toLocaleString('ja-JP');
    }

    function renderCategoryButtons() {
        var unique = ['all'].concat(Array.from(new Set(allItems.map(function(item) { return item.category; }))));
        categories.innerHTML = unique.map(function(cat) {
            return '<button class="market_chip' + (cat === 'all' ? ' active' : '') + '" data-category="' + esc(cat) + '">' + (cat === 'all' ? '全カテゴリ' : esc(cat)) + '</button>';
        }).join('');
    }

    function filteredItems() {
        return allItems.filter(function(item) {
            if (currentCategory !== 'all' && item.category !== currentCategory) return false;
            if (currentCashless !== 'all' && String(item.cashless) !== currentCashless) return false;
            if (currentSearch) {
                var q = currentSearch.toLowerCase();
                var text = [item.title, item.description, item.seller, item.category].join(' ').toLowerCase();
                if (text.indexOf(q) === -1) return false;
            }
            return true;
        });
    }

    function renderCards() {
        var items = filteredItems();
        count.textContent = items.length + '件の商品';
        if (!items.length) {
            grid.innerHTML = '<p class="market_empty">条件に合う商品が見つかりませんでした。</p>';
            return;
        }
        grid.innerHTML = items.map(function(item, idx) {
            var displayStock = item.stock;
            var displayPrice = yen(item.price);
            if (item.variations && item.variations.length > 0) {
                displayStock = item.variations.reduce(function(sum, v) { return sum + (v.stock || 0); }, 0);
                var minPrice = Math.min.apply(null, item.variations.map(function(v) { return v.price; }));
                var maxPrice = Math.max.apply(null, item.variations.map(function(v) { return v.price; }));
                if (minPrice === maxPrice) {
                    displayPrice = yen(minPrice);
                } else {
                    displayPrice = yen(minPrice) + '〜';
                }
            }

            var variationTag = '';
            if (item.variations && item.variations.length > 0) {
                variationTag = '<span class="market_variation_tag">全' + item.variations.length + '種（詳細）</span>';
            }

            return '<article class="market_card" tabindex="0" role="button" data-id="' + esc(item.id) + '" style="animation-delay:' + Math.min(idx * 0.04, 0.4) + 's">' +
                '<div class="market_img_wrap"><img src="' + esc(item.photo) + '" alt="' + esc(item.title) + '" loading="lazy" decoding="async"></div>' +
                '<div class="market_card_body"><div class="market_card_top"><span class="market_category">' + esc(item.category) + '</span><span class="market_stock">在庫 ' + esc(displayStock) + '</span></div>' +
                '<h2>' + esc(item.title) + '</h2><p>' + esc(item.description) + '</p>' +
                '<div class="market_meta"><strong>' + displayPrice + '</strong><span>' + esc(item.seller) + '</span></div>' +
                '<div class="market_tags"><span class="market_pay ' + (item.cashless ? 'ok' : 'cash') + '">' + (item.cashless ? 'キャッシュレス対応' : '現金のみ') + '</span>' + variationTag + '</div></div>' +
            '</article>';
        }).join('');
    }

    function openModal(item) {
        document.getElementById('market_modal_img').src = item.photo;
        document.getElementById('market_modal_img').alt = item.title;
        document.getElementById('market_modal_category').textContent = item.category;
        document.getElementById('market_modal_title').textContent = item.title;
        document.getElementById('market_modal_desc').textContent = item.description;
        document.getElementById('market_modal_seller').textContent = item.seller;
        document.getElementById('market_modal_cashless').textContent = item.cashless ? 'キャッシュレス対応' : '現金のみ';

        var priceWrap = document.getElementById('market_modal_price_wrap');
        var stockWrap = document.getElementById('market_modal_stock_wrap');
        var variationsContainer = document.getElementById('market_modal_variations');

        if (item.variations && item.variations.length > 0) {
            if(priceWrap) priceWrap.style.display = 'none';
            if(stockWrap) stockWrap.style.display = 'none';
            
            var tableHTML = '<table class="market_modal_variations_table">' +
                '<thead><tr><th>種類</th><th>金額</th><th>在庫数</th></tr></thead><tbody>' +
                item.variations.map(function(v) {
                    return '<tr><td>' + esc(v.name) + '</td><td>' + yen(v.price) + '</td><td>' + esc(v.stock) + '</td></tr>';
                }).join('') +
                '</tbody></table>';
            if(variationsContainer) {
                variationsContainer.innerHTML = tableHTML;
                variationsContainer.style.display = 'block';
            }
        } else {
            if(priceWrap) priceWrap.style.display = '';
            if(stockWrap) stockWrap.style.display = '';
            var priceEl = document.getElementById('market_modal_price');
            var stockEl = document.getElementById('market_modal_stock');
            if(priceEl) priceEl.textContent = yen(item.price);
            if(stockEl) stockEl.textContent = item.stock;
            
            if(variationsContainer) {
                variationsContainer.innerHTML = '';
                variationsContainer.style.display = 'none';
            }
        }

        overlay.classList.add('active');
        document.body.classList.add('market_modal_open');
        closeBtn.focus();
    }

    function closeModal() {
        overlay.classList.remove('active');
        document.body.classList.remove('market_modal_open');
    }

    categories.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-category]');
        if (!btn) return;
        currentCategory = btn.dataset.category;
        categories.querySelectorAll('.market_chip').forEach(function(b) { b.classList.toggle('active', b === btn); });
        renderCards();
    });

    cashlessButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            currentCashless = btn.dataset.cashless;
            cashlessButtons.forEach(function(b) { b.classList.toggle('active', b === btn); });
            renderCards();
        });
    });

    search.addEventListener('input', function() {
        currentSearch = search.value.trim();
        renderCards();
    });

    grid.addEventListener('click', function(e) {
        var card = e.target.closest('.market_card');
        if (!card) return;
        var item = allItems.find(function(i) { return i.id === card.dataset.id; });
        if (item) openModal(item);
    });

    grid.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var card = e.target.closest('.market_card');
        if (!card) return;
        e.preventDefault();
        var item = allItems.find(function(i) { return i.id === card.dataset.id; });
        if (item) openModal(item);
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal(); });

    fetch(dataUrl).then(function(res) { return res.json(); }).then(function(data) {
        allItems = data;
        renderCategoryButtons();
        renderCards();
    }).catch(function(err) {
        console.error('Failed to load market data:', err);
        grid.innerHTML = '<p class="market_empty">データの読み込みに失敗しました。</p>';
    });
})();
