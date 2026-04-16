// Loading Screen (top page)
// sessionStorage: show only on first access, skip on reload
// Low-power mode fallback: if video autoplay fails, display static image instead

(function() {
    var loadingScreen = document.getElementById("loading_screen");
    if (!loadingScreen) return;

    var alreadyLoaded = sessionStorage.getItem("gakuensai_loaded");
    var video = document.getElementById("loading_video");
    var fallbackImage = document.getElementById("loading_image");

    // Reload or same-session re-access: hide immediately
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

    // Initially hide fallback image
    if (fallbackImage) {
        fallbackImage.style.display = "none";
    }

    // Try to play video; on failure (low-power mode), switch to static image
    if (video) {
        var playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(function() {
                // Video playing successfully - hide fallback image
                if (fallbackImage) {
                    fallbackImage.style.display = "none";
                }
            }).catch(function(error) {
                // Autoplay blocked (low-power mode, etc.) - show fallback image
                console.log("Autoplay was prevented, switching to fallback image:", error);
                video.style.display = "none";
                if (fallbackImage) {
                    fallbackImage.style.display = "block";
                }
            });
        }
    }

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
                // Stop video and release resources
                if (video) {
                    video.pause();
                }
            }, 800);
        }, remaining);
    }

    // Hide on video end or page load complete
    if (video) {
        video.addEventListener("ended", hideLoading);
    }

    // Fallback: hide on page load complete
    if (document.readyState === "complete") {
        hideLoading();
    } else {
        window.addEventListener("load", hideLoading);
    }
})();
