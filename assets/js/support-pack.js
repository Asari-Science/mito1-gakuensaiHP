// ============================================================
// 学苑祭応援パック モーダル
// - ボタンクリックでモーダル表示
// - URLハッシュ #support-pack で直リンク表示にも対応
// - Esc キー / オーバーレイクリック / 閉じるボタンで閉じる
// - フォーカストラップでアクセシビリティ対応
// ============================================================
(function () {
    'use strict';

    var HASH = '#support-pack';

    var overlay = document.getElementById('support_pack_modal_overlay');
    var openBtn = document.getElementById('support_pack_open');
    var closeBtn = document.getElementById('support_pack_modal_close');
    if (!overlay || !openBtn || !closeBtn) return;

    var modal = overlay.querySelector('.support_pack_modal');
    var lastFocused = null;

    /* ---- Focusable elements within modal (focus trap) ---- */
    function getFocusable() {
        return modal.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]),' +
            ' textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
    }

    /* ---- Open ---- */
    function openModal(updateHash) {
        if (overlay.classList.contains('active')) return;
        lastFocused = document.activeElement;

        overlay.hidden = false;
        // 次フレームで active を付与してトランジションを発火させる
        requestAnimationFrame(function () {
            overlay.classList.add('active');
        });
        document.body.classList.add('support_pack_modal_open');

        // モーダル本体にフォーカス（閉じるボタンよりも自然な開始点）
        modal.focus({ preventScroll: true });

        if (updateHash !== false && window.location.hash !== HASH) {
            // 履歴を汚さずに直リンク用ハッシュを付与
            try {
                history.replaceState(null, '', HASH);
            } catch (e) {
                window.location.hash = HASH;
            }
        }
    }

    /* ---- Close ---- */
    function closeModal(updateHash) {
        if (!overlay.classList.contains('active')) return;
        overlay.classList.remove('active');
        document.body.classList.remove('support_pack_modal_open');

        // トランジション終了後に hidden 化
        var onEnd = function () {
            if (!overlay.classList.contains('active')) {
                overlay.hidden = true;
            }
            overlay.removeEventListener('transitionend', onEnd);
        };
        overlay.addEventListener('transitionend', onEnd);
        // フォールバック
        setTimeout(function () {
            if (!overlay.classList.contains('active')) overlay.hidden = true;
        }, 400);

        if (updateHash !== false && window.location.hash === HASH) {
            try {
                history.replaceState(null, '', window.location.pathname + window.location.search);
            } catch (e) {
                window.location.hash = '';
            }
        }

        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus({ preventScroll: true });
        }
    }

    /* ---- Events ---- */
    openBtn.addEventListener('click', function () { openModal(true); });
    closeBtn.addEventListener('click', function () { closeModal(true); });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal(true);
    });

    document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('active')) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal(true);
            return;
        }

        // Focus trap
        if (e.key === 'Tab') {
            var focusables = getFocusable();
            if (!focusables.length) return;
            var first = focusables[0];
            var last  = focusables[focusables.length - 1];
            var active = document.activeElement;

            if (e.shiftKey && (active === first || active === modal)) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    /* ---- Direct link via hash ---- */
    function checkHash() {
        if (window.location.hash === HASH) {
            openModal(false);
        }
    }

    window.addEventListener('hashchange', function () {
        if (window.location.hash === HASH) {
            openModal(false);
        } else {
            closeModal(false);
        }
    });

    // 初回ロード時にハッシュをチェック
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkHash);
    } else {
        checkHash();
    }
})();
