<?php if (!isset($base_path)) $base_path = '.'; ?>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-588E3Z6HDM"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-588E3Z6HDM');
</script>

<div class="header_frame">
    <div class="header_bg" id="header_bg">
        <div class="header_countdown" id="header_countdown"></div>
    </div>
    <a href="https://gakuensai.net">
        <img src="<?php echo $base_path; ?>/materials/header_title.webp" class="header_icon" alt="第78回学苑祭" />
    </a>
    <div class="menu_btn" id="menu_btn">
        <span></span>
        <span></span>
        <span></span>
    </div>
    <nav class="menu" id="menu">
        <div class="menu_inner">
            <div class="menu_header_label">MENU</div>
            <a href="https://gakuensai.net">Top</a>
            <a href="https://gakuensai.net/blog/">Blog</a>
            <a href="<?php echo $base_path; ?>/pages/comingsoon.php">企画紹介</a>
            <a href="<?php echo $base_path; ?>/pages/comingsoon.php">リーフレット</a>
            <a href="<?php echo $base_path; ?>/pages/comingsoon.php">ステージタイムテーブル</a>
            <a href="<?php echo $base_path; ?>/pages/comingsoon.php">喫茶メニュー</a>
            <a href="<?php echo $base_path; ?>/pages/comingsoon.php">グッズページ</a>
            <a href="<?php echo $base_path; ?>/pages/comingsoon.php">お問い合わせ</a>
            <a href="<?php echo $base_path; ?>/pages/access.php">アクセス</a>
            <a href="<?php echo $base_path; ?>/pages/comingsoon.php">落とし物・忘れ物</a>
            <div class="menu_footer_sns">
                <a href="https://x.com/Enjitsu78th" class="menu_sns_link" aria-label="X (Twitter)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.instagram.com/enjitsu78th" class="menu_sns_link" aria-label="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" class="menu_sns_link" aria-label="LINE">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 10.304c0-5.231-5.383-9.486-12-9.486s-12 4.255-12 9.486c0 4.69 4.27 8.607 10.038 9.352.391.084.924.258 1.058.594.121.303.079.778.038 1.083l-.164 1.025c-.049.303-.238 1.187 1.026.647 1.264-.54 6.819-4.017 9.302-6.878 1.706-1.859 2.641-3.69 2.641-5.823zm-15.004 3.39h-2.155v-4.597h.653v3.944h1.502v.653zm3.172 0h-.653v-4.597h.653v4.597zm3.149 0h-.653l-1.636-2.45v2.45h-.653v-4.597h.653l1.636 2.452v-2.452h.653v4.597zm3.018-3.944h-1.502v1.31h1.502v.653h-1.502v1.328h1.502v.653h-2.155v-4.597h2.155v.653z"/></svg>
                </a>
            </div>
        </div>
    </nav>
</div>

<script>
    window.addEventListener('scroll', function() {
        const headerBg = document.getElementById('header_bg');
    
        // スクロール量が 50px を超えたら active クラスを追加
        if (window.scrollY > 50) {
            headerBg.classList.add('active');
        } else {
            headerBg.classList.remove('active');
        }
    });

    // カウントダウンタイマー（header_bg active時のみ表示）
    (function() {
        var targetDate = new Date('2026-06-20T11:00:00+09:00').getTime();
        var countdownEl = document.getElementById('header_countdown');
        if (!countdownEl) return;

        function updateCountdown() {
            var now = new Date().getTime();
            var diff = targetDate - now;

            if (diff <= 0) {
                // 開催日以降の対応は後で実装
                countdownEl.textContent = '';
                return;
            }

            var days = Math.floor(diff / (1000 * 60 * 60 * 24));
            var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            countdownEl.textContent = '第78回学苑祭まで ' + days + '日 ' + hours + '時間 ' + minutes + '分';
        }

        updateCountdown();
        setInterval(updateCountdown, 60000); // 1分ごとに更新
    })();
</script>
