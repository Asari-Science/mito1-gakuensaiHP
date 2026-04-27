// ============================================================
// Loading Screen (top page)
// ------------------------------------------------------------
// Responsive video selection:
//   - Mobile (<= 767px) : materials/NowLoading/mobile_NowLoading.webm
//                         (fallback to mobile_NowLoading.mp4)
//                         (low-power autoplay fallback: mobile_NowLoading.webp)
//   - Tablet / PC (>= 768px) : materials/NowLoading/NowLoading.webm
//                              (fallback to NowLoading.mp4)
//                              (low-power autoplay fallback: NowLoading.webp)
//
// sessionStorage flag "gakuensai_loaded": if present, skip loading screen.
// ============================================================

(function () {
    var loadingScreen = document.getElementById("loading_screen");
    if (!loadingScreen) return;

    var alreadyLoaded = sessionStorage.getItem("gakuensai_loaded");

    // Detect mobile via media query (responsive to actual viewport, not UA)
    var isMobile = window.matchMedia("(max-width: 767px)").matches;

    // Resolve base path from data attribute on the loading screen (set by PHP)
    var basePath = loadingScreen.getAttribute("data-base-path") || ".";
    // Normalize trailing slash
    basePath = basePath.replace(/\/+$/, "");

    var assets = isMobile
        ? {
              webm: basePath + "/materials/NowLoading/mobile_NowLoading.webm",
              mp4:  basePath + "/materials/NowLoading/mobile_NowLoading.mp4",
              webp: basePath + "/materials/NowLoading/mobile_NowLoading.webp"
          }
        : {
              webm: basePath + "/materials/NowLoading/NowLoading.webm",
              mp4:  basePath + "/materials/NowLoading/NowLoading.mp4",
              webp: basePath + "/materials/NowLoading/NowLoading.webp"
          };

    var video = document.getElementById("loading_video");
    var fallbackImage = document.getElementById("loading_image");

    // ---------- Same-session re-access: hide immediately ----------
    if (alreadyLoaded === "true") {
        loadingScreen.style.display = "none";
        loadingScreen.classList.add("hidden");
        if (video) {
            try {
                video.pause();
                video.removeAttribute("src");
                while (video.firstChild) video.removeChild(video.firstChild);
                video.load();
            } catch (e) {}
        }
        return;
    }

    // ---------- Setup video sources & fallback image dynamically ----------
    if (fallbackImage) {
        fallbackImage.src = assets.webp;
        fallbackImage.style.display = "none";
        fallbackImage.classList.toggle("is-mobile", isMobile);
    }

    function clearVideoSources(v) {
        while (v.firstChild) v.removeChild(v.firstChild);
    }

    function appendSource(v, src, type) {
        var s = document.createElement("source");
        s.src = src;
        s.type = type;
        v.appendChild(s);
    }

    if (video) {
        video.classList.toggle("is-mobile", isMobile);

        // Required attributes for autoplay on mobile (iOS especially)
        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        video.setAttribute("autoplay", "");
        video.preload = "auto";

        clearVideoSources(video);
        appendSource(video, assets.webm, "video/webm");
        appendSource(video, assets.mp4,  "video/mp4");
        // Tell the video element to (re)load with new sources
        try { video.load(); } catch (e) {}

        // Try to autoplay; on failure (low-power mode etc.) fall back to webp image
        var triedFallback = false;
        function activateFallback(reason) {
            if (triedFallback) return;
            triedFallback = true;
            console.log("[loading] fallback to image:", reason);
            video.style.display = "none";
            if (fallbackImage) {
                fallbackImage.style.display = "block";
            }
        }

        var playPromise;
        try {
            playPromise = video.play();
        } catch (e) {
            activateFallback(e);
        }

        if (playPromise && typeof playPromise.then === "function") {
            playPromise
                .then(function () {
                    if (fallbackImage) fallbackImage.style.display = "none";
                })
                .catch(function (error) {
                    activateFallback(error);
                });
        }

        // Some browsers don't return a promise; also listen for error events
        video.addEventListener("error", function (e) {
            activateFallback("video error event");
        });
        // Some low-power devices fire 'suspend' before playback; if no progress in 2s, fallback
        setTimeout(function () {
            if (!triedFallback && video.paused && video.readyState < 2) {
                activateFallback("autoplay timeout");
            }
        }, 2000);
    } else if (fallbackImage) {
        // No video element: show image only
        fallbackImage.style.display = "block";
    }

    // ---------- Hide loading screen ----------
    var startTime = Date.now();
    var minDuration = 1500;
    var hidden = false;

    function hideLoading() {
        if (hidden) return;
        hidden = true;
        var elapsed = Date.now() - startTime;
        var remaining = Math.max(0, minDuration - elapsed);

        setTimeout(function () {
            loadingScreen.classList.add("fade-out");
            sessionStorage.setItem("gakuensai_loaded", "true");

            setTimeout(function () {
                loadingScreen.classList.add("hidden");
                loadingScreen.style.display = "none";
                if (video) {
                    try { video.pause(); } catch (e) {}
                }
            }, 800);
        }, remaining);
    }

    if (video) {
        video.addEventListener("ended", hideLoading);
    }

    if (document.readyState === "complete") {
        hideLoading();
    } else {
        window.addEventListener("load", hideLoading);
    }

    // Safety net: never keep loading screen longer than 8 seconds
    setTimeout(hideLoading, 8000);
})();
