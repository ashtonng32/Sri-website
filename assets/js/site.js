/* Skyline Reclamation: the few things the design kit (assets/kit) does not do. */
(function () {
  "use strict";

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // contact.html?topic=safety-docs pre-checks "Safety documentation request"
  var topic = new URLSearchParams(window.location.search).get("topic");
  if (topic) {
    document.querySelectorAll('[data-topic="' + topic.replace(/[^a-z-]/g, "") + '"]').forEach(function (box) {
      box.checked = true;
    });
  }
})();
