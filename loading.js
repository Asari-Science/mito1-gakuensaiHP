// Loading Screen (トップページ専用)
// sessionStorageを使用: 同一タブでの再読み込みではスキップ、タブを閉じたらリセット

(function() {
    var loadingScreen = document.getElementById("loading_screen");
    if (!loadingScreen) return;

    var alreadyLoaded = sessionStorage.getItem("gakuensai_loaded");

    if (alreadyLoaded === "true") {
        loadingScreen.classList.add("hidden");
        return;
    }

    var startTime = Date.now();
    var minDuration = 1000;

    function hideLoading() {
        var elapsed = Date.now() - startTime;
        var remaining = Math.max(0, minDuration - elapsed);

        setTimeout(function() {
            loadingScreen.classList.add("fade-out");
            sessionStorage.setItem("gakuensai_loaded", "true");

            setTimeout(function() {
                loadingScreen.classList.add("hidden");
            }, 800);
        }, remaining);
    }

    if (document.readyState === "complete") {
        hideLoading();
    } else {
        window.addEventListener("load", hideLoading);
    }
})();
