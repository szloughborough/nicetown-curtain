/* NICETOWN — shared interaction layer.
   Head snippets load GA4 / Clarity; this file emits affiliate_click events. */
(function () {
  "use strict";

  /* ---- theme ---- */
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem("nt-theme");
    if (saved) root.setAttribute("data-theme", saved);
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
      root.setAttribute("data-theme", "dark");
  } catch (e) { /* storage blocked — keep default */ }
  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("nt-theme", next); } catch (e) {}
    themeBtn.setAttribute("aria-label", next === "dark" ? "Switch to light theme" : "Switch to dark theme");
  });

  /* ---- mobile menu (scoped strictly to #site-nav, never bare <nav>) ---- */
  var menuBtn = document.getElementById("menu-toggle");
  var nav = document.getElementById("site-nav");
  function closeMenu() {
    if (!nav) return;
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    if (nav) nav.setAttribute("aria-hidden", "false");
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ---- category dropdown (desktop hover-free, tap-safe) ---- */
  var toggles = document.querySelectorAll(".nav-toggle");
  toggles.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      var willOpen = !panel.classList.contains("open");
      document.querySelectorAll(".dropdown.open").forEach(function (p) { p.classList.remove("open"); });
      document.querySelectorAll(".nav-toggle").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
      if (willOpen) { panel.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".dropdown") && !e.target.closest(".nav-toggle")) {
      document.querySelectorAll(".dropdown.open").forEach(function (p) { p.classList.remove("open"); });
      document.querySelectorAll(".nav-toggle").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    }
  });

  /* ---- FAQ accordion: content is already in the DOM, never fetched ---- */
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      var expanded = q.getAttribute("aria-expanded") === "true";
      q.setAttribute("aria-expanded", String(!expanded));
      var a = document.getElementById(q.getAttribute("aria-controls"));
      if (a) a.hidden = expanded;
    });
  });

  /* ---- reveal on scroll ---- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0.06 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- variant preselection via ?asin=; canonical stays query-free ---- */
  var variantData = window.NT_VARIANTS || null;
  if (variantData && variantData.length) {
    var params = new URLSearchParams(window.location.search);
    var wanted = params.get("asin");
    var chosen = variantData.find(function (v) { return v.asin === wanted; }) || variantData[0];

    function select(v, push) {
      var main = document.getElementById("pdp-main-image");
      if (main) { main.src = v.image; main.alt = v.alt; }
      var price = document.getElementById("pdp-price-value");
      if (price) price.innerHTML = v.price_html;
      var rating = document.getElementById("pdp-rating-value");
      if (rating) rating.innerHTML = v.rating_html;
      var sku = document.getElementById("pdp-sku");
      if (sku) sku.textContent = v.asin;
      var cta = document.getElementById("pdp-buy-cta");
      if (cta) cta.href = v.cta;
      var cta2 = document.getElementById("pdp-shop-cta");
      if (cta2) cta2.href = v.cta;
      document.querySelectorAll("[data-variant-asin]").forEach(function (el) {
        el.classList.toggle("is-selected", el.getAttribute("data-variant-asin") === v.asin);
      });
      document.querySelectorAll(".thumb").forEach(function (t) {
        t.classList.toggle("active", t.getAttribute("data-variant-asin") === v.asin);
      });
      if (push) {
        var u = new URL(window.location.href);
        u.searchParams.set("asin", v.asin);
        window.history.replaceState({}, "", u.pathname + u.search);
      }
    }
    document.querySelectorAll("[data-variant-select]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        var a = el.getAttribute("data-variant-asin");
        var v = variantData.find(function (x) { return x.asin === a; });
        if (v) { e.preventDefault(); select(v, true); }
      });
    });
    select(chosen, false);
  }

  /* ---- deal filters (deals page only) ---- */
  var dealGrid = document.getElementById("deal-grid");
  if (dealGrid) {
    var cards = dealGrid.querySelectorAll(".deal-card");
    var count = document.getElementById("deal-count");
    document.querySelectorAll("[data-deal-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-deal-filter");
        document.querySelectorAll("[data-deal-filter]").forEach(function (b) {
          var active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", String(active));
        });
        var shown = 0;
        cards.forEach(function (card) {
          var visible = key === "all" || card.getAttribute("data-cat") === key;
          card.hidden = !visible;
          if (visible) shown++;
        });
        if (count) count.textContent = "Showing " + shown + " "
          + (shown === 1 ? "deal" : "deals")
          + (key === "all" ? "" : " in this collection");
      });
    });
  }

  /* ---- event status: factual only, never claims an event price ---- */
  var status = document.getElementById("bf-status");
  if (status) {
    var now = new Date();
    var bf = new Date(2026, 10, 27);
    var cmEnd = new Date(2026, 10, 30, 23, 59, 59);
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (today < bf) {
      var days = Math.round((bf - today) / 86400000);
      status.textContent = "Black Friday is in " + days + " "
        + (days === 1 ? "day" : "days") + " (November 27, 2026). The savings below are current price reductions, not confirmed event prices.";
    } else if (now <= cmEnd) {
      status.textContent = "Black Friday and Cyber Monday week is here. Check Amazon for the live price on every product.";
    } else {
      status.textContent = "The 2026 Black Friday and Cyber Monday event has ended. Prices below are a historical snapshot — check Amazon for current pricing.";
    }
  }

  /* ---- affiliate click attribution ----
     Each page template publishes its own exact-ASIN / storefront link, so the
     affiliate dashboard can separate placements. GA4 adds the exact page path
     and dimension breakdown the affiliate platform cannot carry. */
  document.addEventListener("click", function (ev) {
    var node = ev.target;
    if (!node || !node.closest) return;
    var a = node.closest("a[data-nt-asin], a[data-nt-storefront]");
    if (!a) return;
    var payload = {
      link_type: a.getAttribute("data-nt-storefront") ? "storefront" : "product",
      asin: a.getAttribute("data-nt-asin") || "",
      page_template: a.getAttribute("data-nt-template") || "",
      placement: a.getAttribute("data-nt-placement") || "",
      page_path: location.pathname,
      destination: "amazon.com"
    };
    try {
      if (typeof window.gtag === "function") window.gtag("event", "affiliate_click", payload);
    } catch (e) { /* analytics must never block navigation */ }
    try {
      if (typeof window.clarity === "function")
        window.clarity("set", "last_affiliate_click",
                       payload.link_type + ":" + payload.page_template);
    } catch (e) { /* optional */ }
  }, { passive: true, capture: true });
})();
