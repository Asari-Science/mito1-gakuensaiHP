// Loading Screen (top page)
// Responsive source selection + low-power autoplay fallback.
(function() {
    var loadingScreen = document.getElementById("loading_screen");
    if (!loadingScreen) return;

    var alreadyLoaded = sessionStorage.getItem("gakuensai_loaded");
    var video = document.getElementById("loading_video");
    var fallbackImage = document.getElementById("loading_image");

    function isMobilePhone() {
        return window.matchMedia("(max-width: 767px), (pointer: coarse) and (max-width: 900px)").matches;
    }

    function selectResponsiveSource() {
        var mobile = isMobilePhone();
        if (fallbackImage) {
            fallbackImage.src = mobile ? fallbackImage.dataset.mobileWebp : fallbackImage.dataset.pcWebp;
        }
        if (!video) return;
        var desiredSrc = mobile ? video.dataset.mobileWebm : video.dataset.pcWebm;
        var source = video.querySelector("source");
        if (source && source.getAttribute("src") !== desiredSrc) {
            source.setAttribute("src", desiredSrc);
            source.setAttribute("type", "video/webm");
            video.load();
        }
    }

    selectResponsiveSource();

    if (alreadyLoaded === "true") {
        loadingScreen.style.display = "none";
        loadingScreen.classList.add("hidden");
        if (video) {
            video.pause();
            video.removeAttribute("src");
            video.load();
        }
        return;
    }

    if (fallbackImage) fallbackImage.style.display = "none";

    function showFallback() {
        if (video) video.style.display = "none";
        if (fallbackImage) fallbackImage.style.display = "block";
    }

    if (video) {
        var playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(function() {
                if (fallbackImage) fallbackImage.style.display = "none";
            }).catch(function(error) {
                console.log("Autoplay was prevented, switching to responsive fallback image:", error);
                showFallback();
            });
        }
        setTimeout(function() {
            if (video.paused && !loadingScreen.classList.contains("fade-out")) showFallback();
        }, 700);
    }

    var startTime = Date.now();
    var minDuration = 1500;
    var hidden = false;

    function hideLoading() {
        if (hidden) return;
        hidden = true;
        var elapsed = Date.now() - startTime;
        var remaining = Math.max(0, minDuration - elapsed);
        setTimeout(function() {
            loadingScreen.classList.add("fade-out");
            sessionStorage.setItem("gakuensai_loaded", "true");
            setTimeout(function() {
                loadingScreen.classList.add("hidden");
                loadingScreen.style.display = "none";
                if (video) video.pause();
            }, 800);
        }, remaining);
    }

    if (video) video.addEventListener("ended", hideLoading);
    if (document.readyState === "complete") hideLoading();
    else window.addEventListener("load", hideLoading);
})();
