// Concept View Page - Scroll Reveal & Particle Effects

(function() {
    'use strict';

    // ===== Star Field Generator =====
    var starsContainer = document.getElementById('concept_stars');
    if (starsContainer) {
        var starCount = 80;
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

    // ===== Rising Particles Generator (Section 2) =====
    var particlesContainer = document.getElementById('concept_particles');
    if (particlesContainer) {
        var particleCount = 20;
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

    // ===== Parallax Scroll Effect (subtle) =====
    var s1Bg = document.querySelector('.concept_s1_bg');
    var s3Rays = document.querySelector('.concept_s3_rays');

    function handleParallax() {
        var scrollY = window.pageYOffset;
        var vh = window.innerHeight;

        // Section 1 background slight movement
        if (s1Bg) {
            var s1Offset = scrollY * 0.15;
            s1Bg.style.transform = 'translateY(' + s1Offset + 'px)';
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
