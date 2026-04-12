// メニュー用

const menu_btn = document.getElementById("menu_btn");
const menu = document.getElementById("menu");
const header_bg = document.getElementById("header_bg");

menu_btn.addEventListener("click", () => {
    menu_btn.classList.toggle("active");
    menu.classList.toggle("active");
    header_bg.classList.toggle("active");
});

// お知らせ・ブログ欄の自動更新
//（両方とも今年度の更新がまだない（のと正常に動作しているかがローカル県境で確認できなかった）ため無効化しています。ブログの更新が始まるまで動かさないでください） 

/*

// 読み込み完了後に実行
document.addEventListener('DOMContentLoaded', () => {
    // お知らせの取得
    fetchPosts('news_list', 3); 
    
    // ブログの取得
    fetchPosts('blog_list', 4); 
});

// targetId: HTMLの挿入先のID, categoryId: WordPressのカテゴリーID
async function fetchPosts(targetId, categoryId) {
    // カテゴリ取得
    const apiUrl = `https://gakuensai.cloudfree.jp/wp/wp-json/wp/v2/posts?categories=${categoryId}`;
    
    const listElement = document.getElementById(targetId);
    if (!listElement) return;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('ネットワークエラー');
        
        const posts = await response.json();
        listElement.innerHTML = ''; // 読み込み中の文字を消す

        // 5回ループしてリストを作成
        for (let i = 0; i < 5; i++) {
            const li = document.createElement('li');

            if (posts[i]) {
                const date = new Date(posts[i].date).toLocaleDateString('ja-JP');
                const title = posts[i].title.rendered;
                const link = posts[i].link;

                li.innerHTML = `
                    <span class="news_date">${date}</span>
                    <a href="${link}" target="_blank" class="news_title">${title}</a>
                `;
            } else {
                li.innerHTML = `
                    <span class="news_date">&nbsp;</span>
                    <span class="news_title">&nbsp;</span>
                `;
            }
            listElement.appendChild(li);
        }

    } catch (error) {
        console.error('記事の取得に失敗しました:', error);
        listElement.innerHTML = '<p>記事の取得に失敗しました。</p>';
    }
}

*/