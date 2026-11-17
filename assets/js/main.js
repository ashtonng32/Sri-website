/* Skyline Reclamation — small progressive enhancements. Site works without JS. */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Mobile nav
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Services dropdown toggle (needed for touch and mobile)
  document.querySelectorAll(".dropdown-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.closest(".has-dropdown");
      var open = li.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".has-dropdown.open").forEach(function (li) {
      if (!li.contains(e.target) && !document.body.classList.contains("nav-open")) {
        li.classList.remove("open");
        li.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false");
      }
    });
  });

  // Fade-in on scroll
  var items = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Pre-check "Safety documentation request" when linked from the Safety page
  if (/[?&]topic=safety-docs/.test(location.search)) {
    var cb = document.querySelector('input[data-topic="safety-docs"]');
    if (cb) cb.checked = true;
  }

  // Forms: until a real endpoint is configured (see README), show a helpful
  // message instead of posting to a placeholder URL.
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action") || "";
      var status = form.querySelector(".form-status");
      if (!form.checkValidity()) return;
      if (action.indexOf("[") !== -1 || action === "" || action === "#") {
        e.preventDefault();
        if (status) {
          status.innerHTML = "<strong>Thanks — this form isn’t connected yet.</strong> " +
            "Please call <a href=\"tel:+14354273900\">(435) 427-3900</a> or email " +
            "<a href=\"mailto:johnlee@skylinereclamation.com\">johnlee@skylinereclamation.com</a> and we’ll get right back to you.";
          status.classList.add("show");
          status.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
        }
      }
    });
  });
})();
