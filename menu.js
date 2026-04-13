// メニュー用

const menu_btn = document.getElementById("menu_btn");
const menu = document.getElementById("menu");
const header_bg = document.getElementById("header_bg");

menu_btn.addEventListener("click", () => {
    menu_btn.classList.toggle("active");
    menu.classList.toggle("active");
    header_bg.classList.toggle("active");

    if (menu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
    }
});

// メニュー内のリンクをクリックしたらメニューを閉じる
const menuLinks = menu.querySelectorAll("a");
menuLinks.forEach(function(link) {
    link.addEventListener("click", function() {
        menu_btn.classList.remove("active");
        menu.classList.remove("active");
        header_bg.classList.remove("active");
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
    });
});

// セクションのフェードイン表示
const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1
};

const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            sectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll("section").forEach(function(section) {
    if (section.id !== "top") {
        sectionObserver.observe(section);
    }
});

// お知らせ・ブログ欄の自動更新

// 読み込み完了後に実行
document.addEventListener('DOMContentLoaded', () => {
    // お知らせの取得 (categoryId: 6)
    fetchPosts('news_list', 6); 
    
    // ブログの取得 (categoryId: 5)
    fetchPosts('blog_list', 5); 
});

// targetId: HTMLの挿入先のID, categoryId: WordPressのカテゴリーID
async function fetchPosts(targetId, categoryId) {
    // カテゴリ取得
    const apiUrl = `https://gakuensai.net/blog/wp-json/wp/v2/posts?categories=${categoryId}&per_page=3`;
    
    const listElement = document.getElementById(targetId);
    if (!listElement) return;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('ネットワークエラー');
        
        const posts = await response.json();
        listElement.innerHTML = ''; // 読み込み中の文字を消す

        if (posts.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = `<span class="news_title">まだ投稿はありません。</span>`;
            listElement.appendChild(li);
            return;
        }

        // 取得した件数分（最大3件）ループしてリストを作成
        posts.forEach(post => {
            const li = document.createElement('li');

            const postDate = new Date(post.date);
            const dateStr = postDate.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).replace(/\//g, '.');

            const title = post.title.rendered;
            const link = post.link;

            // 2日以内（48時間以内）ならNew!バッジを表示
            const now = new Date();
            const diffMs = now - postDate;
            const diffDays = diffMs / (1000 * 60 * 60 * 24);
            const isNew = diffDays <= 2;
            const newBadge = isNew ? '<span class="new_badge">New!</span>' : '';

            li.innerHTML = `
                <a href="${link}" target="_blank" class="news_item_link">
                    <span class="news_date">${dateStr}</span>
                    <span class="news_title">${title}${newBadge}</span>
                    <span class="news_arrow"></span>
                </a>
            `;
            listElement.appendChild(li);
        });

    } catch (error) {
        console.error('記事の取得に失敗しました:', error);
        listElement.innerHTML = '<li><span class="news_title">記事の取得に失敗しました。</span></li>';
    }
}
