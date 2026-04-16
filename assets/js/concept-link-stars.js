// Concept Link Card - Mini Star Field
(function() {
    var container = document.getElementById('concept_link_stars');
    if (!container) return;

    var count = 30;
    for (var i = 0; i < count; i++) {
        var star = document.createElement('div');
        star.style.cssText =
            'position:absolute;border-radius:50%;background:rgba(255,255,255,0.6);' +
            'animation:conceptLinkStar ' + (2 + Math.random() * 3) + 's ease-in-out infinite;' +
            'animation-delay:' + (Math.random() * 4) + 's;' +
            'left:' + (Math.random() * 100) + '%;' +
            'top:' + (Math.random() * 100) + '%;' +
            'width:' + (1 + Math.random() * 1.5) + 'px;' +
            'height:' + (1 + Math.random() * 1.5) + 'px;' +
            'opacity:' + (0.2 + Math.random() * 0.4);
        container.appendChild(star);
    }
})();
