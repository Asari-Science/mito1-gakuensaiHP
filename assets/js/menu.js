// ============================================================
// Hierarchical Menu Controller
// - Two-pane category/item layout
// - Hover/focus/click to expand category and show items in right pane
// - Keyboard navigation: ArrowUp/Down/Left/Right, Home/End, Enter, Esc
// - ARIA attributes (aria-expanded / aria-hidden / hidden)
// - Body scroll lock when menu is open
// ============================================================

const menu_btn = document.getElementById("menu_btn");
const menu = document.getElementById("menu");
const header_bg = document.getElementById("header_bg");
const header_frame = document.querySelector(".header_frame");

const menuCategories = menu ? menu.querySelectorAll(".menu_category") : [];
const menuItemsLists = menu ? menu.querySelectorAll(".menu_items") : [];
const menuHint = document.getElementById("menu_hint");
const menuBreadcrumb = document.getElementById("menu_breadcrumb");

// --- Body scroll lock helpers ---
function lockBodyScroll() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    if (header_frame) header_frame.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
}

function unlockBodyScroll() {
    document.body.style.paddingRight = "";
    if (header_frame) header_frame.style.paddingRight = "";
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
}

// --- Show specific category items ---
function showCategory(targetId, opts = {}) {
    const focusFirstItem = !!opts.focusFirstItem;

    // Update categories aria-expanded
    let activeCategoryBtn = null;
    menuCategories.forEach(btn => {
        const isActive = btn.dataset.target === targetId;
        btn.setAttribute("aria-expanded", isActive ? "true" : "false");
        if (isActive) activeCategoryBtn = btn;
    });

    // Hide hint, show target items list
    if (menuHint) {
        menuHint.hidden = true;
        menuHint.classList.add("is-hidden");
    }

    menuItemsLists.forEach(list => {
        if (list.id === targetId) {
            list.hidden = false;
        } else {
            list.hidden = true;
        }
    });

    // Update breadcrumb
    if (menuBreadcrumb && activeCategoryBtn) {
        const label = activeCategoryBtn.querySelector(".cat_label");
        menuBreadcrumb.textContent = label ? label.textContent : "";
    }

    // Optional: focus first item in newly shown list
    if (focusFirstItem) {
        const targetList = document.getElementById(targetId);
        if (targetList) {
            const firstLink = targetList.querySelector('a[role="menuitem"]');
            if (firstLink) firstLink.focus();
        }
    }
}

function clearActiveCategory() {
    menuCategories.forEach(btn => btn.setAttribute("aria-expanded", "false"));
    menuItemsLists.forEach(list => { list.hidden = true; });
    if (menuHint) {
        menuHint.hidden = false;
        menuHint.classList.remove("is-hidden");
    }
    if (menuBreadcrumb) menuBreadcrumb.textContent = "";
}

// --- Open / Close menu ---
function openMenu() {
    if (!menu || !menu_btn) return;
    menu_btn.classList.add("active");
    menu.classList.add("active");
    menu_btn.setAttribute("aria-expanded", "true");
    menu_btn.setAttribute("aria-label", "メニューを閉じる");
    menu.setAttribute("aria-hidden", "false");

    lockBodyScroll();

    // Auto-select first category for instant context
    const firstCategoryBtn = menuCategories[0];
    if (firstCategoryBtn) {
        showCategory(firstCategoryBtn.dataset.target);
    }
}

function closeMenu() {
    if (!menu || !menu_btn) return;
    menu_btn.classList.remove("active");
    menu.classList.remove("active");
    menu_btn.setAttribute("aria-expanded", "false");
    menu_btn.setAttribute("aria-label", "メニューを開く");
    menu.setAttribute("aria-hidden", "true");

    unlockBodyScroll();

    // Reset state for next open
    clearActiveCategory();

    // Return focus to the trigger
    menu_btn.focus({ preventScroll: true });
}

if (menu_btn && menu) {
    menu_btn.addEventListener("click", () => {
        if (menu.classList.contains("active")) {
            closeMenu();
        } else {
            openMenu();
        }
    });
}

// --- Category interactions ---
menuCategories.forEach((btn, idx) => {
    const targetId = btn.dataset.target;

    // Hover: open category (desktop)
    btn.addEventListener("mouseenter", () => {
        if (!menu.classList.contains("active")) return;
        // Only auto-show on hover for non-touch devices
        if (window.matchMedia("(hover: hover)").matches) {
            showCategory(targetId);
        }
    });

    // Focus: open category (keyboard)
    btn.addEventListener("focus", () => {
        if (!menu.classList.contains("active")) return;
        showCategory(targetId);
    });

    // Click/tap: toggle category
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        showCategory(targetId);
    });

    // Keyboard navigation between categories
    btn.addEventListener("keydown", (e) => {
        const total = menuCategories.length;
        let nextIdx = idx;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                nextIdx = (idx + 1) % total;
                menuCategories[nextIdx].focus();
                break;
            case "ArrowUp":
                e.preventDefault();
                nextIdx = (idx - 1 + total) % total;
                menuCategories[nextIdx].focus();
                break;
            case "Home":
                e.preventDefault();
                menuCategories[0].focus();
                break;
            case "End":
                e.preventDefault();
                menuCategories[total - 1].focus();
                break;
            case "ArrowRight":
            case "Enter":
            case " ": {
                // Move into the items pane
                e.preventDefault();
                showCategory(targetId, { focusFirstItem: true });
                break;
            }
            case "Escape":
                e.preventDefault();
                closeMenu();
                break;
        }
    });
});

// --- Item links keyboard navigation ---
menuItemsLists.forEach(list => {
    const links = list.querySelectorAll('a[role="menuitem"]');
    links.forEach((link, idx) => {
        link.addEventListener("keydown", (e) => {
            const total = links.length;
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    links[(idx + 1) % total].focus();
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    links[(idx - 1 + total) % total].focus();
                    break;
                case "ArrowLeft": {
                    // Return focus to current category button
                    e.preventDefault();
                    const targetId = list.id;
                    const catBtn = Array.from(menuCategories).find(b => b.dataset.target === targetId);
                    if (catBtn) catBtn.focus();
                    break;
                }
                case "Home":
                    e.preventDefault();
                    links[0].focus();
                    break;
                case "End":
                    e.preventDefault();
                    links[total - 1].focus();
                    break;
                case "Escape":
                    e.preventDefault();
                    closeMenu();
                    break;
            }
        });

        // Closing menu on link click (navigating)
        link.addEventListener("click", () => {
            // Allow same-page anchors to close the menu without preventing default navigation
            menu_btn.classList.remove("active");
            menu.classList.remove("active");
            menu_btn.setAttribute("aria-expanded", "false");
            menu.setAttribute("aria-hidden", "true");
            unlockBodyScroll();
        });
    });
});

// --- Esc anywhere in menu closes it ---
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu && menu.classList.contains("active")) {
        closeMenu();
    }
});

// --- Click outside menu inner area closes (extra safety, but background covers full screen) ---
// (Skipped because menu is fullscreen overlay; trigger button handles toggle.)

// ============================================================
// Section fade-in (existing behaviour, preserved)
// ============================================================

const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1
};

const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            sectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll("section").forEach(function(section) {
    if (section.id !== "top") {
        sectionObserver.observe(section);
    }
});

// ============================================================
// WordPress feed (preserved)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    fetchPosts('news_list', 6);
    fetchPosts('blog_list', 5);
});

async function fetchPosts(targetId, categoryId) {
    const apiUrl = `https://gakuensai.net/blog/wp-json/wp/v2/posts?categories=${categoryId}&per_page=3`;

    const listElement = document.getElementById(targetId);
    if (!listElement) return;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('ネットワークエラー');

        const posts = await response.json();
        listElement.innerHTML = '';

        if (posts.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = `<span class="news_title">まだ投稿はありません。</span>`;
            listElement.appendChild(li);
            return;
        }

        posts.forEach(post => {
            const li = document.createElement('li');

            const postDate = new Date(post.date);
            const dateStr = postDate.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).replace(/\//g, '.');

            const title = post.title.rendered;
            const link = post.link;

            const now = new Date();
            const diffMs = now - postDate;
            const diffDays = diffMs / (1000 * 60 * 60 * 24);
            const isNew = diffDays <= 2;
            const newBadge = isNew ? '<span class="new_badge">New!</span>' : '';

            li.innerHTML = `
                <a href="${link}" target="_blank" class="news_item_link">
                    <span class="news_date">${dateStr}</span>
                    <span class="news_title">${title}${newBadge}</span>
                    <span class="news_arrow"></span>
                </a>
            `;
            listElement.appendChild(li);
        });

    } catch (error) {
        console.error('記事の取得に失敗しました:', error);
        listElement.innerHTML = '<li><span class="news_title">記事の取得に失敗しました。</span></li>';
    }
}
