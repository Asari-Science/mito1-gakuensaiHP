// Error pages - Star field generator
(function() {
    var starsContainer = document.getElementById('error_stars');
    if (!starsContainer) return;

    var starCount = 60;

    for (var i = 0; i < starCount; i++) {
        var star = document.createElement('div');
        star.className = 'error_star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 70 + '%';
        star.style.animationDelay = (Math.random() * 5) + 's';
        star.style.animationDuration = (2 + Math.random() * 4) + 's';

        var size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.opacity = Math.random() * 0.5 + 0.2;

        starsContainer.appendChild(star);
    }
})();
