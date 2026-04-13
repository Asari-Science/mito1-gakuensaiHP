// Loading Screen (トップページ専用)
// sessionStorageを使用: 初回アクセスのみ表示、リロード時は一切表示しない

(function() {
    var loadingScreen = document.getElementById("loading_screen");
    if (!loadingScreen) return;

    var alreadyLoaded = sessionStorage.getItem("gakuensai_loaded");

    // リロードまたは同一セッション内での再アクセス時は即座に非表示（表示すら開始しない）
    if (alreadyLoaded === "true") {
        loadingScreen.style.display = "none";
        loadingScreen.classList.add("hidden");
        // 動画の読み込みも止める
        var video = document.getElementById("loading_video");
        if (video) {
            video.pause();
            video.removeAttribute("src");
            video.load();
        }
        return;
    }

    var video = document.getElementById("loading_video");
    var startTime = Date.now();
    var minDuration = 1500;

    function hideLoading() {
        var elapsed = Date.now() - startTime;
        var remaining = Math.max(0, minDuration - elapsed);

        setTimeout(function() {
            loadingScreen.classList.add("fade-out");
            sessionStorage.setItem("gakuensai_loaded", "true");

            setTimeout(function() {
                loadingScreen.classList.add("hidden");
                loadingScreen.style.display = "none";
                // 動画を停止してリソース解放
                if (video) {
                    video.pause();
                }
            }, 800);
        }, remaining);
    }

    // 動画の終了またはページ読み込み完了で非表示にする
    if (video) {
        video.addEventListener("ended", hideLoading);
    }

    // フォールバック: ページ読み込み完了後にも非表示にする（動画が短い場合やエラー時）
    if (document.readyState === "complete") {
        hideLoading();
    } else {
        window.addEventListener("load", hideLoading);
    }
})();
