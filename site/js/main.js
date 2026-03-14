/* ==========================================================================
   main.js — Navigation, Dropdowns, Hamburger Menu, Scroll Spy
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- DOM refs ---------- */
  var hamburger = document.getElementById('hamburger');
  var navMenu   = document.getElementById('navbar-menu');
  var sidebar   = document.getElementById('sidebar');
  var tocLinks  = [];

  /* ==========================================================================
     HAMBURGER MENU TOGGLE (mobile < 768px)
     ========================================================================== */
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* ==========================================================================
     DROPDOWN MENUS — mobile tap/toggle behavior
     On desktop, CSS :hover handles dropdowns. On mobile, we toggle on tap.
     ========================================================================== */
  var dropdownToggles = document.querySelectorAll('.has-dropdown > .dropdown-toggle');
  var isMobile = function () { return window.innerWidth < 1200; };

  Array.prototype.forEach.call(dropdownToggles, function (toggle) {
    toggle.addEventListener('click', function (e) {
      if (!isMobile()) return; // let CSS :hover handle desktop
      var parent = toggle.parentElement;

      // If dropdown is already open, allow navigation to the overview page
      if (parent.classList.contains('dropdown-open')) {
        return; // follow the link
      }

      // First tap: open the dropdown, prevent navigation
      e.preventDefault();

      // Close other open dropdowns
      var allDropdowns = document.querySelectorAll('.has-dropdown.dropdown-open');
      Array.prototype.forEach.call(allDropdowns, function (el) {
        if (el !== parent) el.classList.remove('dropdown-open');
      });

      parent.classList.add('dropdown-open');
    });
  });

  // Close mobile dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    if (!isMobile()) return;
    if (!e.target.closest('.has-dropdown')) {
      var allDropdowns = document.querySelectorAll('.has-dropdown.dropdown-open');
      Array.prototype.forEach.call(allDropdowns, function (el) {
        el.classList.remove('dropdown-open');
      });
    }
  });

  /* ==========================================================================
     SCROLL SPY — highlight active TOC link based on scroll position
     ========================================================================== */
  function initScrollSpy() {
    var tocContainer = document.getElementById('toc');
    if (!tocContainer) return;

    tocLinks = Array.prototype.slice.call(tocContainer.querySelectorAll('a[href^="#"]'));
    if (tocLinks.length === 0) return;

    // Build list of heading elements referenced by TOC links
    var headings = [];
    tocLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) headings.push({ el: el, link: link });
    });

    if (headings.length === 0) return;

    var navbarHeight = 56;
    var offset = navbarHeight + 24;

    function onScroll() {
      var scrollY = window.scrollY || window.pageYOffset;
      var activeIndex = 0;

      for (var i = 0; i < headings.length; i++) {
        if (headings[i].el.getBoundingClientRect().top <= offset) {
          activeIndex = i;
        }
      }

      tocLinks.forEach(function (link) { link.classList.remove('active'); });
      headings[activeIndex].link.classList.add('active');
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Run once on load
    onScroll();
  }

  /* ==========================================================================
     SMOOTH SCROLL — TOC link clicks scroll smoothly (with offset for sticky nav)
     ========================================================================== */
  function initSmoothScroll() {
    var tocContainer = document.getElementById('toc');
    if (!tocContainer) return;

    tocContainer.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      var navbarHeight = 56;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     CLOSE MOBILE MENU ON NAV LINK CLICK
     ========================================================================== */
  if (navMenu) {
    navMenu.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;
      // If it's a dropdown toggle on mobile, don't close the menu
      if (link.classList.contains('dropdown-toggle') && isMobile()) return;
      // Close hamburger menu
      if (hamburger && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollSpy();
    initSmoothScroll();
  });

})();
