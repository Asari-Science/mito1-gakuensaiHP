// Concept View Page - Scroll Reveal & Particle Effects & Shooting Stars & Enhanced Parallax

(function() {
    'use strict';

    // ===== Star Field Generator (Section 1) =====
    var starsContainer = document.getElementById('concept_stars');
    if (starsContainer) {
        var starCount = 120;
        for (var i = 0; i < starCount; i++) {
            var star = document.createElement('div');
            star.className = 'concept_star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = (Math.random() * 5) + 's';
            star.style.animationDuration = (2 + Math.random() * 4) + 's';
            var size = Math.random() * 2 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.opacity = Math.random() * 0.5 + 0.2;
            starsContainer.appendChild(star);
        }
    }

    // ===== Star Field for Section 3 (fading as sky brightens) =====
    var s3StarsContainer = document.getElementById('concept_s3_stars');
    if (s3StarsContainer) {
        var s3StarCount = 40;
        for (var i = 0; i < s3StarCount; i++) {
            var star = document.createElement('div');
            star.className = 'concept_star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 60 + '%';
            star.style.animationDelay = (Math.random() * 5) + 's';
            star.style.animationDuration = (2 + Math.random() * 4) + 's';
            var size = Math.random() * 1.5 + 0.5;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.opacity = Math.random() * 0.3 + 0.1;
            s3StarsContainer.appendChild(star);
        }
    }

    // ===== Rising Particles Generator (Section 2) =====
    var particlesContainer = document.getElementById('concept_particles');
    if (particlesContainer) {
        var particleCount = 25;
        for (var i = 0; i < particleCount; i++) {
            var particle = document.createElement('div');
            particle.className = 'concept_s2_particle';
            particle.style.left = (Math.random() * 90 + 5) + '%';
            particle.style.animationDelay = -(Math.random() * 10) + 's';
            particle.style.animationDuration = (6 + Math.random() * 8) + 's';
            var pSize = Math.random() * 3 + 1;
            particle.style.width = pSize + 'px';
            particle.style.height = pSize + 'px';
            particle.style.opacity = Math.random() * 0.3 + 0.1;
            particlesContainer.appendChild(particle);
        }
    }

    // ===== Shooting Star System =====
    var shootingStarContainer = document.getElementById('concept_shooting_star');

    function createShootingStar() {
        if (!shootingStarContainer) return;

        var trail = document.createElement('div');
        trail.className = 'shooting_star_trail';

        // Randomize start position (upper portion of screen)
        var startX = Math.random() * 80 + 10; // 10-90% from left
        var startY = Math.random() * 40; // 0-40% from top

        // Direction: generally top-right to bottom-left or top-left to bottom-right
        var angle = 20 + Math.random() * 30; // 20-50 degrees
        if (Math.random() > 0.5) angle = -angle; // randomly flip direction

        var distance = 200 + Math.random() * 300;
        var radAngle = angle * (Math.PI / 180);
        var endX = startX + (Math.cos(radAngle) * distance / window.innerWidth * 100);
        var endY = startY + (Math.sin(radAngle) * distance / window.innerHeight * 100);

        var trailLength = 80 + Math.random() * 100;
        var duration = 0.8 + Math.random() * 0.8;

        trail.style.setProperty('--start-x', startX + 'vw');
        trail.style.setProperty('--start-y', startY + 'vh');
        trail.style.setProperty('--end-x', endX + 'vw');
        trail.style.setProperty('--end-y', endY + 'vh');
        trail.style.setProperty('--angle', angle + 'deg');
        trail.style.setProperty('--trail-length', trailLength + 'px');
        trail.style.setProperty('--duration', duration + 's');

        shootingStarContainer.appendChild(trail);

        // Remove after animation completes
        setTimeout(function() {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, duration * 1000 + 200);
    }

    // Random shooting star timer (average every 15-40 seconds)
    function scheduleNextShootingStar() {
        var delay = 15000 + Math.random() * 25000; // 15-40 seconds
        setTimeout(function() {
            createShootingStar();
            scheduleNextShootingStar();
        }, delay);
    }

    // Start the random shooting star cycle
    if (shootingStarContainer) {
        // First one after 5-15 seconds
        setTimeout(function() {
            createShootingStar();
            scheduleNextShootingStar();
        }, 5000 + Math.random() * 10000);
    }

    // ===== Expose shooting star function for debugging =====
    // Usage: Open browser console and run shootingStar() to trigger a shooting star
    window.shootingStar = function() {
        createShootingStar();
        console.log('%c★ 流れ星が流れました！ Lucky! ★', 'color: #f6dc9f; background: #0a1128; padding: 4px 12px; border-radius: 4px; font-size: 14px;');
    };

    // ===== Intersection Observer for Reveal =====
    var revealElements = document.querySelectorAll('.concept_reveal');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    // Stagger delay based on element index within its parent section
                    var section = entry.target.closest('.concept_section');
                    if (section) {
                        var siblings = section.querySelectorAll('.concept_reveal');
                        var index = Array.prototype.indexOf.call(siblings, entry.target);
                        entry.target.style.transitionDelay = (index * 0.12) + 's';
                    }
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        });

        revealElements.forEach(function(el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show all elements immediately
        revealElements.forEach(function(el) {
            el.classList.add('is-visible');
        });
    }

    // ===== Enhanced Parallax Scroll Effect =====
    var s1Bg = document.querySelector('.concept_s1_bg');
    var s2Bg = document.querySelector('.concept_s2_bg');
    var s3Bg = document.querySelector('.concept_s3_bg');
    var s3Rays = document.querySelector('.concept_s3_rays');
    var s3StarsEl = document.querySelector('.concept_s3_stars');

    var s1Content = document.querySelector('.concept_s1_content');
    var s2Content = document.querySelector('.concept_s2_content');
    var s3Content = document.querySelector('.concept_s3_content');

    function handleParallax() {
        var scrollY = window.pageYOffset;
        var vh = window.innerHeight;

        // Section 1 background: slow scroll creates depth
        if (s1Bg) {
            var s1Offset = scrollY * 0.3;
            s1Bg.style.transform = 'translateY(' + s1Offset + 'px)';
        }

        // Section 1 content: subtle parallax against background
        if (s1Content) {
            var s1Section = document.getElementById('definition');
            if (s1Section) {
                var s1Rect = s1Section.getBoundingClientRect();
                if (s1Rect.bottom > 0 && s1Rect.top < vh) {
                    var s1ContentOffset = scrollY * 0.08;
                    s1Content.style.transform = 'translateY(' + (-s1ContentOffset) + 'px)';
                }
            }
        }

        // Section 2 background parallax
        if (s2Bg) {
            var s2Section = document.getElementById('spirit');
            if (s2Section) {
                var s2Rect = s2Section.getBoundingClientRect();
                var s2ScrollInSection = -s2Rect.top;
                var s2Offset = s2ScrollInSection * 0.2;
                s2Bg.style.transform = 'translateY(' + s2Offset + 'px)';
            }
        }

        // Section 2 content parallax
        if (s2Content) {
            var s2Section = document.getElementById('spirit');
            if (s2Section) {
                var s2Rect = s2Section.getBoundingClientRect();
                if (s2Rect.bottom > 0 && s2Rect.top < vh) {
                    var s2ContentProgress = -s2Rect.top / vh;
                    s2Content.style.transform = 'translateY(' + (s2ContentProgress * -20) + 'px)';
                }
            }
        }

        // Section 3 background parallax
        if (s3Bg) {
            var s3Section = document.getElementById('statement');
            if (s3Section) {
                var s3Rect = s3Section.getBoundingClientRect();
                var s3ScrollInSection = -s3Rect.top;
                var s3Offset = s3ScrollInSection * 0.15;
                s3Bg.style.transform = 'translateY(' + s3Offset + 'px)';
            }
        }

        // Section 3 rays expansion
        if (s3Rays) {
            var s3Section = document.getElementById('statement');
            if (s3Section) {
                var s3Rect = s3Section.getBoundingClientRect();
                var s3Progress = Math.max(0, Math.min(1, 1 - (s3Rect.top / vh)));
                s3Rays.style.opacity = 0.5 + (s3Progress * 0.5);
            }
        }

        // Section 3 stars fade as sky brightens
        if (s3StarsEl) {
            var s3Section = document.getElementById('statement');
            if (s3Section) {
                var s3Rect = s3Section.getBoundingClientRect();
                var s3Progress = Math.max(0, Math.min(1, 1 - (s3Rect.top / vh)));
                s3StarsEl.style.opacity = Math.max(0, 1 - s3Progress * 1.5);
            }
        }
    }

    var ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
})();
