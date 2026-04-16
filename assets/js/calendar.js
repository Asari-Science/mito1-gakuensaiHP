// Google Calendar Confirmation Dialog
(function() {
    'use strict';

    var calendarLinks = {
        '1': 'https://www.google.com/calendar/render?action=TEMPLATE&text=%E7%AC%AC78%E5%9B%9E%E5%AD%A6%E8%8B%91%E7%A5%AD(1%E6%97%A5%E7%9B%AE)&dates=20260620T110000/20260620T163000&location=%E8%8C%A8%E5%9F%8E%E7%9C%8C%E7%AB%8B%E6%B0%B4%E6%88%B8%E7%AC%AC%E4%B8%80%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E3%83%BB%E9%99%84%E5%B1%9E%E4%B8%AD%E5%AD%A6%E6%A0%A1&trp=true&details=%E6%B0%B4%E6%88%B8%E7%AC%AC%E4%B8%80%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E3%83%BB%E9%99%84%E5%B1%9E%E4%B8%AD%E5%AD%A6%E6%A0%A1%E3%81%AE%E6%96%87%E5%8C%96%E7%A5%AD1%E6%97%A5%E7%9B%AE%E3%81%A7%E3%81%99%E3%80%82%0D%0A%E5%85%AC%E5%BC%8FHP%EF%BC%9Ahttps://gakuensai.net/%20%0D%0A%E8%A9%B3%E7%B4%B0%E3%81%AFHP%E3%81%BE%E3%81%9F%E3%81%AFSNS%E3%82%92%E3%81%94%E8%A6%A7%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82&sprop=https://gakuensai.net/',
        '2': 'https://www.google.com/calendar/render?action=TEMPLATE&text=%E7%AC%AC78%E5%9B%9E%E5%AD%A6%E8%8B%91%E7%A5%AD(2%E6%97%A5%E7%9B%AE)&dates=20260621T090000/20260621T130000&location=%E8%8C%A8%E5%9F%8E%E7%9C%8C%E7%AB%8B%E6%B0%B4%E6%88%B8%E7%AC%AC%E4%B8%80%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E3%83%BB%E9%99%84%E5%B1%9E%E4%B8%AD%E5%AD%A6%E6%A0%A1&trp=true&details=%E6%B0%B4%E6%88%B8%E7%AC%AC%E4%B8%80%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E3%83%BB%E9%99%84%E5%B1%9E%E4%B8%AD%E5%AD%A6%E6%A0%A1%E3%81%AE%E6%96%87%E5%8C%96%E7%A5%AD2%E6%97%A5%E7%9B%AE%E3%81%A7%E3%81%99%E3%80%82%0D%0A%E5%85%AC%E5%BC%8FHP%EF%BC%9Ahttps://gakuensai.net/%20%0D%0A%E8%A9%B3%E7%B4%B0%E3%81%AFHP%E3%81%BE%E3%81%9F%E3%81%AFSNS%E3%82%92%E3%81%94%E8%A6%A7%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82&sprop=https://gakuensai.net/'
    };

    var dayLabels = {
        '1': '第78回学苑祭 1日目（6/20 土）',
        '2': '第78回学苑祭 2日目（6/21 日）'
    };

    var overlay = document.getElementById('gcal_overlay');
    var dialogTitle = document.getElementById('gcal_dialog_title');
    var dialogDesc = document.getElementById('gcal_dialog_desc');
    var cancelBtn = document.getElementById('gcal_cancel');
    var confirmBtn = document.getElementById('gcal_confirm');

    if (!overlay || !confirmBtn) return;

    // Open dialog
    function openDialog(day) {
        dialogTitle.textContent = '予定を追加しますか？';
        dialogDesc.textContent = dayLabels[day] + ' をGoogleカレンダーに追加します。';
        confirmBtn.href = calendarLinks[day];
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close dialog
    function closeDialog() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Bind calendar buttons
    var calBtns = document.querySelectorAll('.card_calendar_btn');
    calBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var day = this.getAttribute('data-day');
            openDialog(day);
        });
    });

    // Close handlers
    cancelBtn.addEventListener('click', closeDialog);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeDialog();
    });
    confirmBtn.addEventListener('click', function() {
        setTimeout(closeDialog, 300);
    });

    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeDialog();
        }
    });
})();
