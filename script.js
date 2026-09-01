/* =========================================================
   فلس — Site scripts
   ========================================================= */
(function () {
    'use strict';

    /* ---------- Theme (runs before paint via inline snippet too) ---------- */
    var STORAGE_KEY = 'fils-theme';

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
    }

    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    document.addEventListener('DOMContentLoaded', function () {

        /* ---------- Theme toggle ---------- */
        document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
            });
        });

        /* ---------- Sticky header ---------- */
        var header = document.querySelector('.header');
        if (header) {
            var onScroll = function () {
                header.classList.toggle('is-stuck', window.scrollY > 12);
            };
            onScroll();
            window.addEventListener('scroll', onScroll, { passive: true });
        }

        /* ---------- Mobile menu ---------- */
        var burger = document.querySelector('.nav__burger');
        var menu = document.querySelector('.nav__menu');
        if (burger && menu) {
            burger.addEventListener('click', function () {
                var open = menu.classList.toggle('is-open');
                burger.classList.toggle('is-open', open);
                burger.setAttribute('aria-expanded', String(open));
            });
            menu.querySelectorAll('a').forEach(function (a) {
                a.addEventListener('click', function () {
                    menu.classList.remove('is-open');
                    burger.classList.remove('is-open');
                    burger.setAttribute('aria-expanded', 'false');
                });
            });
        }

        /* ---------- Mark active nav link ---------- */
        var page = location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav__link').forEach(function (link) {
            var href = link.getAttribute('href') || '';
            if (href === page || (page === 'index.html' && href === './')) {
                link.classList.add('is-active');
            }
        });

        /* ---------- Scroll reveal ---------- */
        var items = document.querySelectorAll('[data-reveal]');
        if (!('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('is-in'); });
        } else {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var delay = parseInt(entry.target.getAttribute('data-reveal-delay') || '0', 10);
                    setTimeout(function () { entry.target.classList.add('is-in'); }, delay);
                    io.unobserve(entry.target);
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
            items.forEach(function (el) { io.observe(el); });
        }

        /* ---------- Smooth scroll for in-page anchors ---------- */
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var id = a.getAttribute('href');
                if (!id || id === '#') return;
                var target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', id);
            });
        });

        /* ---------- Contact form (front-end only) ---------- */
        var form = document.querySelector('[data-contact-form]');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                if (!form.checkValidity()) { form.reportValidity(); return; }
                var status = form.querySelector('.form__status');
                if (status) {
                    status.textContent = 'شكراً لك! وصلتنا رسالتك وسنعود إليك خلال يوم عمل واحد.';
                    status.classList.add('is-visible');
                }
                form.reset();
            });
        }

        /* ---------- Footer year ---------- */
        document.querySelectorAll('[data-year]').forEach(function (el) {
            el.textContent = new Date().getFullYear().toLocaleString('ar-EG', { useGrouping: false });
        });
    });
})();
