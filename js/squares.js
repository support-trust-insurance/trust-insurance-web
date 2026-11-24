// Cuadrícula interactiva del hero: los cuadros se encienden en azul al pasar el cursor
// y se apagan despacio. Los cuadros bajo el texto y el cotizador no se activan.
(function () {
  var hero = document.querySelector('[data-squares]');
  if (!hero) return;

  var holder = document.createElement('div');
  holder.className = 'squares';
  holder.setAttribute('aria-hidden', 'true');
  hero.insertBefore(holder, hero.firstChild);

  var cell = 88, cols = 0, rows = 0, cells = [], lit = null, keep = 'h1, .eyebrow, .lead, .hero-actions, .chips, .quote-card';

  function size() {
    cell = parseFloat(getComputedStyle(hero).getPropertyValue('--cell')) || 88;
  }

  function build() {
    size();
    var c = Math.ceil(hero.clientWidth / cell), r = Math.ceil(hero.clientHeight / cell);
    if (c === cols && r === rows) return;
    cols = c; rows = r; cells = []; lit = null;
    holder.textContent = '';
    for (var y = 0; y < rows; y++) {
      var row = document.createElement('div');
      row.className = 'squares-row';
      for (var x = 0; x < cols; x++) {
        var sq = document.createElement('div');
        sq.className = 'sq';
        sq.style.setProperty('--r', y);
        sq.style.setProperty('--c', x);
        row.appendChild(sq);
        cells.push(sq);
      }
      holder.appendChild(row);
    }
    hero.classList.add('has-squares');
  }

  // Un cuadro está "bajo contenido" si se cruza con el texto o la tarjeta del hero.
  function covered(x, y) {
    var hr = hero.getBoundingClientRect(), pad = 6;
    var L = hr.left + x * cell, T = hr.top + y * cell, R = L + cell, B = T + cell;
    var els = hero.querySelectorAll(keep);
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      if (r.width && r.height && L < r.right + pad && R > r.left - pad && T < r.bottom + pad && B > r.top - pad) return true;
    }
    return false;
  }

  function light(e) {
    var hr = hero.getBoundingClientRect();
    var x = Math.floor((e.clientX - hr.left) / cell), y = Math.floor((e.clientY - hr.top) / cell);
    if (x < 0 || y < 0 || x >= cols || y >= rows) return clear();
    var idx = y * cols + x;
    if (cells[idx] === lit) return;
    clear();
    if (covered(x, y)) return;
    lit = cells[idx];
    lit.classList.add('lit');
  }

  function clear() {
    if (lit) { lit.classList.remove('lit'); lit = null; }
  }

  build();
  if (window.ResizeObserver) new ResizeObserver(build).observe(hero); else window.addEventListener('resize', build);
  hero.addEventListener('pointermove', light);
  hero.addEventListener('pointerdown', light);
  hero.addEventListener('pointerleave', clear);
})();
