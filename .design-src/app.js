/* Kürşat Ürensü — portfolyo.
   Tasarımdaki bileşen davranışının birebir karşılığı: sayfa durumu, gezinme
   vurgusu ve GitHub katkı grafiği. */
(function () {
  "use strict";

  // Tasarımdaki düzenleyici ayarlarının varsayılanları.
  var config = {
    startPage: "home",
    showGithub: true
  };

  var main = document.getElementById("ku-main");
  var pages = document.querySelectorAll(".ku-page");
  var navLinks = document.querySelectorAll("[data-nav]");
  var page = config.startPage || "home";

  function render() {
    for (var i = 0; i < pages.length; i++) {
      pages[i].hidden = pages[i].getAttribute("data-page") !== page;
    }
    // "Projeler" sekmesi, proje detayında da etkin kalır.
    for (var j = 0; j < navLinks.length; j++) {
      var key = navLinks[j].getAttribute("data-nav");
      var active = key === page || (key === "projects" && page === "detail");
      if (active) navLinks[j].setAttribute("aria-current", "page");
      else navLinks[j].removeAttribute("aria-current");
    }
  }

  // Tasarımda sayfa değişimi <main> öğesini yeniden bağlar; geçiş animasyonu
  // burada aynı etkiyi vermek için yeniden başlatılır.
  function replayFade() {
    if (!main) return;
    main.style.animation = "none";
    void main.offsetWidth;
    main.style.animation = "";
  }

  window.go = function (event, target) {
    if (event) event.preventDefault();
    if (target === page) {
      window.scrollTo(0, 0);
      return;
    }
    page = target;
    render();
    replayFade();
    window.scrollTo(0, 0);
  };

  // GitHub katkı grafiği — tasarımdaki sözde rastgele dizinin aynısı.
  function buildContributions() {
    var host = document.getElementById("ku-contrib");
    if (!host) return;
    var levels = [
      "transparent",
      "var(--color-accent-200)",
      "var(--color-accent-400)",
      "var(--color-accent-500)",
      "var(--color-accent-700)"
    ];
    var frag = document.createDocumentFragment();
    var seed = 7;
    for (var i = 0; i < 182; i++) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      var r = seed / 2147483648;
      var lvl = r < 0.34 ? 0 : r < 0.58 ? 1 : r < 0.78 ? 2 : r < 0.93 ? 3 : 4;
      var cell = document.createElement("span");
      cell.style.aspectRatio = "1";
      cell.style.background = levels[lvl];
      cell.style.border = lvl === 0 ? "1px solid var(--color-neutral-300)" : "none";
      cell.style.display = "block";
      frag.appendChild(cell);
    }
    host.appendChild(frag);
  }

  function applySectionToggles() {
    var github = document.querySelector('[data-if="showGithub"]');
    if (github) github.hidden = config.showGithub === false;
  }

  applySectionToggles();
  buildContributions();
  render();
})();
