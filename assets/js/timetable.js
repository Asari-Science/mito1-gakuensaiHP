// Stage timetable renderer
(function() {
    'use strict';

    var DATA_URL = '../assets/data/stage_timetable.json';
    var MINUTE_HEIGHT = 2.8;
    var currentDayId = 'day1';
    var timetableData = null;
    var currentSchedule = null;
    var redLineTimer = null;

    var board = document.getElementById('tt_board');
    var notice = document.getElementById('tt_weather_notice');
    var intro = document.getElementById('tt_stage_intro');
    var tabs = document.querySelectorAll('.tt_day_tab');

    function esc(str) {
        return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function toMinutes(time) {
        var parts = time.split(':').map(Number);
        return parts[0] * 60 + parts[1];
    }

    function formatDuration(start, end) {
        return start + ' - ' + end;
    }

    function getActiveWeather(data) {
        var mode = window.STAGE_WEATHER_MODE || data.activeWeatherDefault || 'sunny';
        return data.schedules[mode] ? mode : 'sunny';
    }

    function renderStageIntro(items) {
        intro.innerHTML = items.map(function(item) {
            return '<article class="tt_intro_card"><span class="tt_intro_mark">☆</span><div><h2>' + esc(item.title) + '</h2><p>' + esc(item.description) + '</p></div></article>';
        }).join('');
    }

    function buildTimeLabels(day) {
        var start = toMinutes(day.start);
        var end = toMinutes(day.end);
        var html = '<div class="tt_corner">時間</div>';
        for (var m = start; m <= end; m += 15) {
            var top = 48 + (m - start) * MINUTE_HEIGHT;
            var hh = String(Math.floor(m / 60)).padStart(2, '0');
            var mm = String(m % 60).padStart(2, '0');
            html += '<div class="tt_time_label" style="top:' + top + 'px">' + hh + ':' + mm + '</div>';
            html += '<div class="tt_grid_line" style="top:' + top + 'px"></div>';
        }
        return html;
    }

    function eventBlock(event, day) {
        var dayStart = toMinutes(day.start);
        var top = 48 + (toMinutes(event.start) - dayStart) * MINUTE_HEIGHT;
        var height = Math.max(34, (toMinutes(event.end) - toMinutes(event.start)) * MINUTE_HEIGHT - 4);
        var href = event.link || './kikaku.php';
        return '<a class="tt_event" href="' + esc(href) + '" style="top:' + top + 'px;height:' + height + 'px;--event-color:' + esc(event.color || '#8b6914') + '" title="' + esc(event.title) + '">' +
            '<span class="tt_event_time">' + esc(formatDuration(event.start, event.end)) + '</span>' +
            '<strong>' + esc(event.title) + '</strong>' +
            '<span class="tt_event_group">' + esc(event.group) + '</span>' +
            '<span class="tt_event_link">詳細へ</span>' +
        '</a>';
    }

    function renderBoard() {
        if (!currentSchedule || !board) return;
        var day = currentSchedule.days.find(function(d) { return d.id === currentDayId; }) || currentSchedule.days[0];
        currentDayId = day.id;
        var totalHeight = 48 + (toMinutes(day.end) - toMinutes(day.start)) * MINUTE_HEIGHT + 24;
        var html = buildTimeLabels(day);
        html += '<div class="tt_stage_columns" style="height:' + totalHeight + 'px;grid-template-columns:repeat(' + day.stages.length + ', minmax(150px, 1fr));">';
        day.stages.forEach(function(stage) {
            html += '<section class="tt_stage_col" data-stage="' + esc(stage.id) + '">';
            html += '<div class="tt_stage_head"><strong>' + esc(stage.name) + '</strong><span>開始 ' + esc(stage.openFrom) + '</span></div>';
            html += '<div class="tt_stage_lane">';
            day.events.filter(function(ev) { return ev.stageId === stage.id; }).forEach(function(ev) { html += eventBlock(ev, day); });
            html += '</div></section>';
        });
        html += '</div><div class="tt_now_line" id="tt_now_line"><span>現在時刻</span></div>';
        board.style.setProperty('--tt-height', totalHeight + 'px');
        board.innerHTML = html;
        updateNowLine();
    }

    function updateNowLine() {
        var line = document.getElementById('tt_now_line');
        if (!line || !currentSchedule) return;
        var day = currentSchedule.days.find(function(d) { return d.id === currentDayId; });
        if (!day) return;
        var now = new Date();
        var dayDate = day.dateISO;
        var today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
        var nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
        var start = toMinutes(day.start);
        var end = toMinutes(day.end);
        if (today !== dayDate || nowMinutes < start || nowMinutes > end) {
            line.classList.remove('visible');
            return;
        }
        line.style.top = (48 + (nowMinutes - start) * MINUTE_HEIGHT) + 'px';
        line.classList.add('visible');
    }

    function setupTabs() {
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                currentDayId = tab.dataset.day;
                tabs.forEach(function(t) {
                    var active = t === tab;
                    t.classList.toggle('active', active);
                    t.setAttribute('aria-selected', active ? 'true' : 'false');
                });
                renderBoard();
            });
        });
    }

    fetch(DATA_URL).then(function(res) { return res.json(); }).then(function(data) {
        timetableData = data;
        var weather = getActiveWeather(data);
        currentSchedule = data.schedules[weather];
        notice.textContent = currentSchedule.notice;
        notice.dataset.weather = weather;
        renderStageIntro(data.stageDescriptions || []);
        setupTabs();
        renderBoard();
        redLineTimer = setInterval(updateNowLine, 30000);
    }).catch(function(err) {
        console.error('Failed to load stage timetable:', err);
        if (board) board.innerHTML = '<p class="tt_error">タイムテーブルの読み込みに失敗しました。</p>';
    });

    window.addEventListener('beforeunload', function() {
        if (redLineTimer) clearInterval(redLineTimer);
    });
})();
