<div class="header_frame">
    <div class="header_bg" id="header_bg"></div>
    <a href="https://gakuensai.cloudfree.jp">
        <img src="./materials/header_title.webp" class="header_icon" alt="第78回学苑祭" />
    </a>
    <div class="menu_btn" id="menu_btn">
        <span></span>
        <span></span>
        <span></span>
    </div>
    <div class="menu" id="menu">
        <a href="https://gakuensai.cloudfree.jp">Top</a>
        <a href="https://gakuensai.cloudfree.jp/wp/category/blog/">Blog</a>
        <a href="https://gakuensai.cloudfree.jp/comingsoon.html">企画紹介</a>
        <a href="https://gakuensai.cloudfree.jp/comingsoon.html">リーフレット</a>
        <a href="https://gakuensai.cloudfree.jp/comingsoon.html">ステージタイムテーブル</a>
        <a href="https://gakuensai.cloudfree.jp/comingsoon.html">喫茶メニュー</a>
        <a href="https://gakuensai.cloudfree.jp/comingsoon.html">グッズページ</a>
        <a href="https://gakuensai.cloudfree.jp/comingsoon.html">お問い合わせ</a>
        <a href="https://gakuensai.cloudfree.jp/comingsoon.html">アクセス</a>
    </div>
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
</script>