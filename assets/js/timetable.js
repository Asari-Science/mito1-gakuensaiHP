/**
 * Stage timetable renderer
 * - assets/data/stage_timetable.json から晴天時/雨天時のスケジュールを取得
 * - window.STAGE_WEATHER_MODE ('sunny' / 'rainy') を見て表示を切替
 * - 1日目/2日目をタブで切替
 * - 縦軸=時間, 横軸=ステージ のグリッド表示
 * - 現在時刻に動的な赤線を表示
 */
(function() {
    'use strict';

    var DATA_URL = '../assets/data/stage_timetable.json';
    var MINUTE_HEIGHT = 2.8;          // 1分あたりの高さ(px)
    var HEADER_HEIGHT = 52;           // ステージヘッダー(stage_head)の高さ
    var DEFAULT_COLOR = '#8b6914';

    var state = {
        data: null,
        weather: 'sunny',
        currentDayId: 'day1',
        nowLineTimer: null
    };

    // === DOM ===
    var $board       = document.getElementById('tt_board');
    var $notice      = document.getElementById('tt_weather_notice');
    var $intro       = document.getElementById('tt_stage_intro');
    var $boardMeta   = document.getElementById('tt_board_meta');
    var $legendList  = document.getElementById('tt_legend_list');
    var $tabs        = Array.prototype.slice.call(document.querySelectorAll('.tt_day_tab'));

    // === Utilities ===
    function esc(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function pad2(n) { return String(n).padStart(2, '0'); }
    function toMinutes(t) {
        if (!t) return 0;
        var p = String(t).split(':').map(Number);
        return (p[0] || 0) * 60 + (p[1] || 0);
    }
    function fmtTime(m) {
        var h = Math.floor(m / 60);
        return pad2(h) + ':' + pad2(m % 60);
    }
    function getActiveWeather(data) {
        var mode = window.STAGE_WEATHER_MODE || data.activeWeatherDefault || 'sunny';
        return data.schedules && data.schedules[mode] ? mode : 'sunny';
    }

    // === Render: Weather Notice ===
    function renderNotice() {
        if (!$notice) return;
        var weather = state.weather;
        var notices = (state.data && state.data.weatherNotices) || {};
        var schedule = state.data.schedules[weather] || {};
        var text = notices[weather] || schedule.notice || '';
        var label = (state.data.weatherLabels && state.data.weatherLabels[weather]) || weather;
        var icon = weather === 'rainy'
            ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 13v8m-8-8v8m4-10v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>'
            : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
        $notice.dataset.weather = weather;
        $notice.innerHTML =
            '<span class="tt_notice_icon" aria-hidden="true">' + icon + '</span>' +
            '<span class="tt_notice_text"><strong>' + esc(text) + '</strong>' +
            '<span class="tt_notice_sub">表示モード: ' + esc(label) + '</span></span>';
    }

    // === Render: ☆Mプロ / ☆Aステ description ===
    function renderStageIntro(items) {
        if (!$intro) return;
        if (!items || !items.length) { $intro.innerHTML = ''; return; }
        $intro.innerHTML = items.map(function(item) {
            return '<article class="tt_intro_card">' +
                     '<div class="tt_intro_head">' +
                       '<span class="tt_intro_mark" aria-hidden="true">☆</span>' +
                       '<h2>' + esc(item.title || item.name) + '</h2>' +
                     '</div>' +
                     '<p>' + esc(item.description) + '</p>' +
                   '</article>';
        }).join('');
    }

    // === Render: time labels (left rail) ===
    function buildTimeLabels(day) {
        var start = toMinutes(day.start);
        var end = toMinutes(day.end);
        var html = '<div class="tt_corner">時間</div>';
        for (var m = start; m <= end; m += 15) {
            var top = HEADER_HEIGHT + (m - start) * MINUTE_HEIGHT;
            var isHour = (m % 60 === 0);
            html += '<div class="tt_time_label' + (isHour ? ' is_hour' : '') + '" style="top:' + top + 'px">' + fmtTime(m) + '</div>';
            html += '<div class="tt_grid_line' + (isHour ? ' is_hour' : '') + '" style="top:' + top + 'px"></div>';
        }
        return html;
    }

    // === Render: a single event block ===
    function eventBlock(event, day) {
        var dayStart = toMinutes(day.start);
        var top = HEADER_HEIGHT + (toMinutes(event.start) - dayStart) * MINUTE_HEIGHT;
        var height = Math.max(36, (toMinutes(event.end) - toMinutes(event.start)) * MINUTE_HEIGHT - 4);
        var href = event.link || './kikaku.php';
        var color = event.color || DEFAULT_COLOR;
        var stageType = event.stageType ? '<span class="tt_event_badge">' + esc(event.stageType) + '</span>' : '';
        return '<a class="tt_event" href="' + esc(href) + '" ' +
               'style="top:' + top + 'px;height:' + height + 'px;--event-color:' + esc(color) + '" ' +
               'title="' + esc(event.title) + ' / ' + esc(event.group || '') + '">' +
                 '<span class="tt_event_time">' + esc(event.start) + ' - ' + esc(event.end) + '</span>' +
                 '<strong class="tt_event_title">' + esc(event.title) + '</strong>' +
                 '<span class="tt_event_group">' + esc(event.group || '') + '</span>' +
                 '<span class="tt_event_foot">' + stageType + '<span class="tt_event_link">詳細 →</span></span>' +
               '</a>';
    }

    // === Render: timetable board ===
    function renderBoard() {
        if (!$board || !state.data) return;
        var schedule = state.data.schedules[state.weather];
        if (!schedule) return;
        var day = schedule.days.find(function(d) { return d.id === state.currentDayId; }) || schedule.days[0];
        state.currentDayId = day.id;

        var totalMinutes = toMinutes(day.end) - toMinutes(day.start);
        var totalHeight = HEADER_HEIGHT + totalMinutes * MINUTE_HEIGHT + 24;

        var html = buildTimeLabels(day);
        html += '<div class="tt_stage_columns" style="height:' + totalHeight + 'px;grid-template-columns:repeat(' + day.stages.length + ', minmax(150px, 1fr));">';

        day.stages.forEach(function(stage) {
            html += '<section class="tt_stage_col" data-stage="' + esc(stage.id) + '">';
            html += '<div class="tt_stage_head"><strong>' + esc(stage.name) + '</strong>' +
                    '<span>開始 ' + esc(stage.openFrom) + '</span></div>';
            html += '<div class="tt_stage_lane">';
            day.events
                .filter(function(ev) { return ev.stageId === stage.id; })
                .sort(function(a, b) { return toMinutes(a.start) - toMinutes(b.start); })
                .forEach(function(ev) { html += eventBlock(ev, day); });
            html += '</div></section>';
        });
        html += '</div>';
        // 現在時刻の赤線
        html += '<div class="tt_now_line" id="tt_now_line"><span class="tt_now_label">NOW</span><span class="tt_now_time" id="tt_now_time"></span></div>';

        $board.style.setProperty('--tt-height', totalHeight + 'px');
        $board.innerHTML = html;

        // ボードメタ
        if ($boardMeta) {
            $boardMeta.innerHTML =
                '<span class="tt_meta_chip"><strong>' + esc(day.label) + '</strong> ' + esc(day.date) + '</span>' +
                '<span class="tt_meta_chip">開催時間: ' + esc(day.start) + ' 〜 ' + esc(day.end) + '</span>' +
                '<span class="tt_meta_chip">ステージ数: ' + day.stages.length + ' / 演目数: ' + day.events.length + '</span>';
        }

        updateNowLine();
    }

    // === Update: current-time red line ===
    function updateNowLine() {
        var $line = document.getElementById('tt_now_line');
        var $time = document.getElementById('tt_now_time');
        if (!$line || !state.data) return;
        var schedule = state.data.schedules[state.weather];
        if (!schedule) return;
        var day = schedule.days.find(function(d) { return d.id === state.currentDayId; });
        if (!day) return;

        var now = new Date();
        var todayStr = now.getFullYear() + '-' + pad2(now.getMonth() + 1) + '-' + pad2(now.getDate());
        var nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
        var dayStart = toMinutes(day.start);
        var dayEnd = toMinutes(day.end);

        // 表示日でない or 範囲外なら非表示
        if (todayStr !== day.dateISO || nowMin < dayStart || nowMin > dayEnd) {
            $line.classList.remove('visible');
            return;
        }
        $line.style.top = (HEADER_HEIGHT + (nowMin - dayStart) * MINUTE_HEIGHT) + 'px';
        if ($time) {
            $time.textContent = pad2(now.getHours()) + ':' + pad2(now.getMinutes());
        }
        $line.classList.add('visible');
    }

    // === Render: legend (genre/stageType) ===
    function renderLegend() {
        if (!$legendList || !state.data) return;
        var schedule = state.data.schedules[state.weather];
        if (!schedule) return;
        // すべての日のすべてのイベントから stageType + 代表色を抽出
        var map = {};
        schedule.days.forEach(function(day) {
            (day.events || []).forEach(function(ev) {
                var key = ev.stageType || 'その他';
                if (!map[key]) map[key] = ev.color || DEFAULT_COLOR;
            });
        });
        var keys = Object.keys(map);
        if (!keys.length) { $legendList.innerHTML = ''; return; }
        $legendList.innerHTML = keys.map(function(k) {
            return '<li class="tt_legend_item"><span class="tt_legend_swatch" style="background:' + esc(map[k]) + '"></span>' + esc(k) + '</li>';
        }).join('');
    }

    // === Tabs ===
    function setupTabs() {
        $tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                state.currentDayId = tab.dataset.day;
                $tabs.forEach(function(t) {
                    var active = (t === tab);
                    t.classList.toggle('active', active);
                    t.setAttribute('aria-selected', active ? 'true' : 'false');
                });
                renderBoard();
            });

            // キーボード操作（左右矢印）
            tab.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    var idx = $tabs.indexOf(tab);
                    var next = (idx + (e.key === 'ArrowRight' ? 1 : -1) + $tabs.length) % $tabs.length;
                    $tabs[next].focus();
                    $tabs[next].click();
                }
            });
        });
    }

    // === Init ===
    fetch(DATA_URL)
        .then(function(res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(function(data) {
            state.data = data;
            state.weather = getActiveWeather(data);

            renderNotice();
            renderStageIntro(data.stageDescriptions || []);
            setupTabs();
            renderLegend();
            renderBoard();

            // 30秒ごとに現在時刻線を更新
            state.nowLineTimer = setInterval(updateNowLine, 30000);

            // ウィンドウサイズ変更で再描画
            var resizeRaf = null;
            window.addEventListener('resize', function() {
                if (resizeRaf) cancelAnimationFrame(resizeRaf);
                resizeRaf = requestAnimationFrame(updateNowLine);
            });
        })
        .catch(function(err) {
            console.error('Failed to load stage timetable:', err);
            if ($board) {
                $board.innerHTML = '<p class="tt_error">タイムテーブルの読み込みに失敗しました。<br>しばらく経ってから再度お試しください。</p>';
            }
            if ($notice) {
                $notice.dataset.weather = 'error';
                $notice.innerHTML = '<span class="tt_notice_text">データの読み込みに失敗しました。</span>';
            }
        });

    window.addEventListener('beforeunload', function() {
        if (state.nowLineTimer) clearInterval(state.nowLineTimer);
    });
})();
