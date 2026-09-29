/* ==========================================================================
   VGAD Wiki - tick tracking
   A guide opts in by putting data-progress-key="something-unique" on <body>.
   Ticks are stored in that browser only, under that key, so guides don't
   overwrite one another. Pages with no tick boxes are left alone.
   ========================================================================== */

(function () {
  var KEY = document.body.getAttribute("data-progress-key");
  if (!KEY) return;

  var boxes = Array.prototype.slice.call(document.querySelectorAll("input[data-part]"));
  if (!boxes.length) return;

  var progress = document.getElementById("progress");
  var reset = document.getElementById("reset");
  var state = {};

  try { state = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { state = {}; }

  function render() {
    var done = 0;
    boxes.forEach(function (b) {
      var id = b.getAttribute("data-part");
      b.checked = !!state[id];
      if (b.checked) done++;
      var link = document.querySelector('nav.toc a[href="#' + id + '"]');
      if (link) link.classList.toggle("done", b.checked);
    });
    if (progress) progress.textContent = done + " of " + boxes.length + " parts done";
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { }
  }

  boxes.forEach(function (b) {
    b.addEventListener("change", function () {
      state[b.getAttribute("data-part")] = b.checked;
      save();
      render();
    });
  });

  if (reset) {
    reset.addEventListener("click", function () {
      state = {};
      save();
      render();
    });
  }

  render();
})();
