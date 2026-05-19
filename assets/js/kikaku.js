// Kikaku (Events) Page - Search, Filter, Card Grid, Modal, Carousel

(function() {
    'use strict';

    var DATA_URL = '../assets/data/kikaku.json';
    var IMAGE_BASE = '../materials/kikakuimg/';

    var allKikaku = [];
    var currentGenre = 'all';
    var currentDay = 'all';
    var currentSearch = '';
    var carouselIndex = 0;
    var carouselImages = [];
    var currentModalData = null;

    // DOM elements
    var grid = document.getElementById('kikaku_grid');
    var searchInput = document.getElementById('kikaku_search');
    var searchClear = document.getElementById('kikaku_search_clear');
    var filtersContainer = document.getElementById('kikaku_filters');
    var dayFiltersContainer = document.getElementById('kikaku_day_filters');
    var resultCount = document.getElementById('kikaku_result_count');
    var emptyState = document.getElementById('kikaku_empty');
    var emptyReset = document.getElementById('kikaku_empty_reset');

    // Modal elements
    var modalOverlay = document.getElementById('kikaku_modal_overlay');
    var modalClose = document.getElementById('kikaku_modal_close');
    var carouselTrack = document.getElementById('kikaku_carousel_track');
    var carouselPrev = document.getElementById('kikaku_carousel_prev');
    var carouselNext = document.getElementById('kikaku_carousel_next');
    var carouselDots = document.getElementById('kikaku_carousel_dots');
    var modalGenre = document.getElementById('kikaku_modal_genre');
    var modalId = document.getElementById('kikaku_modal_id');
    var modalTitle = document.getElementById('kikaku_modal_title');
    var modalTitleKana = document.getElementById('kikaku_modal_title_kana');
    var modalGroup = document.getElementById('kikaku_modal_group');
    var modalDesc = document.getElementById('kikaku_modal_desc');
    var modalLocation = document.getElementById('kikaku_modal_location');
    var modalMapLink = document.getElementById('kikaku_modal_map_link');
    var modalDay = document.getElementById('kikaku_modal_day');

    // ===== Fetch Data =====
    function fetchData() {
        fetch(DATA_URL)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                allKikaku = data;
                renderCards();
            })
            .catch(function(err) {
                console.error('Failed to load kikaku data:', err);
                grid.innerHTML = '<p style="text-align:center;padding:40px;color:rgba(26,18,7,0.5);font-family:\'Noto Sans JP\',sans-serif;">データの読み込みに失敗しました。</p>';
            });
    }

    // ===== Genre color helper =====
    function genreColorClass(genre) {
        switch (genre) {
            case 'アトラクション（ホラー）': return 'genre_color_attraction_horror';
            case 'アトラクション（ホラー以外）': return 'genre_color_attraction_other';
            case '喫茶': return 'genre_color_cafe';
            case '創作展示': return 'genre_color_exhibition';
            case '映像作品': return 'genre_color_video';
            case 'ステージ': return 'genre_color_stage';
            case '縁日': return 'genre_color_ennichi';
            default: return '';
        }
    }

    // ===== Day label =====
    function dayLabel(day) {
        switch (day) {
            case 'day1': return 'Day 1（6/20）のみ';
            case 'day2': return 'Day 2（6/21）のみ';
            case 'both': return '両日開催';
            default: return day;
        }
    }

    // ===== Filter logic =====
    function getFilteredData() {
        return allKikaku.filter(function(item) {
            // Genre filter
            if (currentGenre !== 'all' && item.genre !== currentGenre) return false;

            // Day filter
            if (currentDay !== 'all') {
                if (item.day === 'both') {
                    // show on any day filter
                } else if (item.day !== currentDay) {
                    return false;
                }
            }

            // Search filter (title・titleKana・group などをまとめて検索)
            if (currentSearch) {
                var q = currentSearch.toLowerCase();
                var searchable = (
                    item.title + ' ' +
                    (item.titleKana || '') + ' ' +
                    item.group + ' ' +
                    item.genre + ' ' +
                    item.location + ' ' +
                    item.pr + ' ' +
                    item.description
                ).toLowerCase();
                if (searchable.indexOf(q) === -1) return false;
            }

            return true;
        });
    }

    // ===== Render Cards =====
    function renderCards() {
        var filtered = getFilteredData();
        grid.innerHTML = '';

        if (filtered.length === 0) {
            emptyState.style.display = 'block';
            resultCount.textContent = '';
        } else {
            emptyState.style.display = 'none';
            resultCount.textContent = filtered.length + '件の企画';

            filtered.forEach(function(item, idx) {
                var card = document.createElement('div');
                card.className = 'kikaku_card';
                card.style.animationDelay = (Math.min(idx, 11) * 0.05) + 's';
                card.setAttribute('data-id', item.id);

                // Image
                var imgWrap = '<div class="kikaku_card_img_wrap">';
                imgWrap += '<span class="kikaku_card_genre" data-genre="' + escHTML(item.genre) + '">' + escHTML(item.genre) + '</span>';
                if (item.images && item.images.length > 0) {
                    imgWrap += '<img class="kikaku_card_img" src="' + IMAGE_BASE + escHTML(item.images[0]) + '" alt="' + escHTML(item.title) + '" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">';
                    imgWrap += '<div class="kikaku_card_img_placeholder" style="display:none;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>';
                } else {
                    imgWrap += '<div class="kikaku_card_img_placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>';
                }
                imgWrap += '</div>';

                // Body
                var body = '<div class="kikaku_card_body">';
                if (item.titleKana) {
                    body += '<p class="kikaku_card_kana" aria-hidden="true">' + escHTML(item.titleKana) + '</p>';
                }
                body += '<h3 class="kikaku_card_title">' + escHTML(item.title) + '</h3>';
                body += '<p class="kikaku_card_group">' + escHTML(item.group) + '</p>';
                body += '<p class="kikaku_card_pr">' + escHTML(item.pr) + '</p>';
                body += '<div class="kikaku_card_footer">';
                body += '<span class="kikaku_card_location"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' + escHTML(item.location) + '</span>';
                body += '</div>';
                body += '</div>';

                card.innerHTML = imgWrap + body;
                card.addEventListener('click', function() { openModal(item); });
                grid.appendChild(card);
            });
        }
    }

    // ===== HTML escape =====
    function escHTML(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ===== Modal =====
    function openModal(item) {
        currentModalData = item;
        carouselIndex = 0;

        // Genre badge
        modalGenre.textContent = item.genre;
        modalGenre.className = 'kikaku_modal_genre ' + genreColorClass(item.genre);
        modalId.textContent = '#' + item.id;

        // Details
        modalTitle.textContent = item.title;
        if (modalTitleKana) {
            if (item.titleKana) {
                modalTitleKana.textContent = item.titleKana;
                modalTitleKana.style.display = '';
            } else {
                modalTitleKana.textContent = '';
                modalTitleKana.style.display = 'none';
            }
        }
        modalGroup.textContent = item.group;
        modalDesc.textContent = item.description;
        modalLocation.textContent = item.location;
        modalDay.textContent = dayLabel(item.day);

        // Map link
        if (item.locationPin) {
            modalMapLink.style.display = 'inline-flex';
            modalMapLink.href = '../pages/leaflet.php#' + item.locationPin;
        } else {
            modalMapLink.style.display = 'none';
        }

        // Carousel
        carouselImages = item.images || [];
        buildCarousel();

        // Show modal
        modalOverlay.classList.add('active');
        document.body.classList.add('kikaku_modal_open');

        // Focus trap
        modalClose.focus();
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('kikaku_modal_open');
        currentModalData = null;
    }

    function buildCarousel() {
        carouselTrack.innerHTML = '';
        carouselDots.innerHTML = '';

        if (carouselImages.length === 0) {
            var slide = document.createElement('div');
            slide.className = 'kikaku_carousel_slide';
            slide.innerHTML = '<div class="kikaku_carousel_slide_placeholder"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>';
            carouselTrack.appendChild(slide);
            carouselPrev.style.display = 'none';
            carouselNext.style.display = 'none';
            return;
        }

        carouselImages.forEach(function(img, i) {
            var slide = document.createElement('div');
            slide.className = 'kikaku_carousel_slide';
            slide.innerHTML = '<img src="' + IMAGE_BASE + escHTML(img) + '" alt="画像 ' + (i+1) + '" loading="lazy" decoding="async" onerror="this.parentElement.innerHTML=\'<div class=kikaku_carousel_slide_placeholder><svg width=48 height=48 viewBox=&quot;0 0 24 24&quot; fill=none stroke=currentColor stroke-width=1.5><rect x=3 y=3 width=18 height=18 rx=2 ry=2/><circle cx=8.5 cy=8.5 r=1.5/><polyline points=&quot;21 15 16 10 5 21&quot;/></svg></div>\'">';
            carouselTrack.appendChild(slide);

            if (carouselImages.length > 1) {
                var dot = document.createElement('div');
                dot.className = 'kikaku_carousel_dot' + (i === 0 ? ' active' : '');
                dot.addEventListener('click', function() {
                    carouselIndex = i;
                    updateCarousel();
                });
                carouselDots.appendChild(dot);
            }
        });

        // Show/hide arrows
        var showArrows = carouselImages.length > 1;
        carouselPrev.style.display = showArrows ? 'flex' : 'none';
        carouselNext.style.display = showArrows ? 'flex' : 'none';

        updateCarousel();
    }

    function updateCarousel() {
        carouselTrack.style.transform = 'translateX(-' + (carouselIndex * 100) + '%)';
        var dots = carouselDots.querySelectorAll('.kikaku_carousel_dot');
        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === carouselIndex);
        });
    }

    // ===== Event Listeners =====

    // Search
    var searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        var val = searchInput.value;
        searchClear.classList.toggle('visible', val.length > 0);
        searchTimeout = setTimeout(function() {
            currentSearch = val.trim();
            renderCards();
        }, 200);
    });

    searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchClear.classList.remove('visible');
        currentSearch = '';
        renderCards();
        searchInput.focus();
    });

    // Genre filters
    filtersContainer.addEventListener('click', function(e) {
        var btn = e.target.closest('.kikaku_filter_btn');
        if (!btn) return;
        filtersContainer.querySelectorAll('.kikaku_filter_btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentGenre = btn.dataset.genre;
        renderCards();
    });

    // Day filters
    dayFiltersContainer.addEventListener('click', function(e) {
        var btn = e.target.closest('.kikaku_day_btn');
        if (!btn) return;
        dayFiltersContainer.querySelectorAll('.kikaku_day_btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentDay = btn.dataset.day;
        renderCards();
    });

    // Empty reset
    emptyReset.addEventListener('click', function() {
        currentGenre = 'all';
        currentDay = 'all';
        currentSearch = '';
        searchInput.value = '';
        searchClear.classList.remove('visible');
        filtersContainer.querySelectorAll('.kikaku_filter_btn').forEach(function(b) { b.classList.remove('active'); });
        filtersContainer.querySelector('[data-genre="all"]').classList.add('active');
        dayFiltersContainer.querySelectorAll('.kikaku_day_btn').forEach(function(b) { b.classList.remove('active'); });
        dayFiltersContainer.querySelector('[data-day="all"]').classList.add('active');
        renderCards();
    });

    // Modal close
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) closeModal();
    });

    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Carousel navigation
    carouselPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        if (carouselImages.length < 2) return;
        carouselIndex = (carouselIndex - 1 + carouselImages.length) % carouselImages.length;
        updateCarousel();
    });

    carouselNext.addEventListener('click', function(e) {
        e.stopPropagation();
        if (carouselImages.length < 2) return;
        carouselIndex = (carouselIndex + 1) % carouselImages.length;
        updateCarousel();
    });

    // Touch swipe for carousel
    var touchStartX = 0;
    var touchEndX = 0;
    var carouselEl = document.getElementById('kikaku_modal_carousel');

    carouselEl.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselEl.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50 && carouselImages.length > 1) {
            if (diff > 0) {
                carouselIndex = (carouselIndex + 1) % carouselImages.length;
            } else {
                carouselIndex = (carouselIndex - 1 + carouselImages.length) % carouselImages.length;
            }
            updateCarousel();
        }
    }, { passive: true });

    // Keyboard navigation for carousel
    document.addEventListener('keydown', function(e) {
        if (!modalOverlay.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') {
            carouselPrev.click();
        } else if (e.key === 'ArrowRight') {
            carouselNext.click();
        }
    });

    // ===== Initialize =====
    fetchData();

})();
