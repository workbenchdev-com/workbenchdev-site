(function () {
  'use strict';
  var root = document.documentElement, body = document.body;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var WA = ['55', '54', '99607', '9383'], MU = 'workbenchdevsupport', MH = 'gmail.com';
  var t0 = Date.now();
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------- Títulos divididos em palavras ---------- */
  function split(el) {
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    el.setAttribute('aria-label', label);
    var frag = document.createDocumentFragment(), i = 0;
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      var g = n.nodeType === 1 && n.tagName === 'EM';
      n.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        var wd = document.createElement('span'); wd.className = 'wd'; wd.setAttribute('aria-hidden', 'true');
        var wi = document.createElement('span'); wi.className = 'wi' + (g ? ' gt' : '');
        wi.style.setProperty('--i', i++); wi.textContent = part;
        wd.appendChild(wi); frag.appendChild(wd);
      });
    });
    el.textContent = ''; el.appendChild(frag);
  }
  $$('.split').forEach(split);
  function fixGrad() {
    $$('.split').forEach(function (h) {
      var gs = $$('.wi.gt', h); if (!gs.length) return;
      var l = 1e9, r = -1e9;
      gs.forEach(function (w) { var b = w.getBoundingClientRect(); l = Math.min(l, b.left); r = Math.max(r, b.right); });
      gs.forEach(function (w) { var b = w.getBoundingClientRect(); w.style.backgroundSize = (r - l) + 'px 100%'; w.style.backgroundPosition = (l - b.left) + 'px 0'; });
    });
  }

  /* ---------- Abertura ---------- */
  var intro = $('#intro'), heroH1 = $('#h1');
  function start() { body.classList.add('go'); heroH1.classList.add('in'); }
  if (root.classList.contains('intro-on')) {
    setTimeout(function () { intro.classList.add('open'); setTimeout(start, 300); }, 1000);
    setTimeout(function () { root.classList.remove('intro-on'); }, 1800);
  } else { start(); }

  /* ---------- Revelar ao rolar ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.2 });
  $$('.split, .fd, .steps').forEach(function (el) { if (el !== heroH1) io.observe(el); });

  /* ---------- Contato ---------- */
  function openUrl(url) { var a = document.createElement('a'); a.href = url; a.style.display = 'none'; body.appendChild(a); a.click(); a.remove(); }
  /* O número só é montado num clique real de pessoa (não fica no HTML para robôs coletarem). */
  $$('[data-wa]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (!e.isTrusted || Date.now() - t0 < 1500) return;
      window.open('https://wa.me/' + WA.join('') + '?text=' + encodeURIComponent('Olá! Vim pelo site da workbenchdev e gostaria de conversar sobre um projeto.'), '_blank', 'noopener');
    });
  });
  $$('[data-mail]').forEach(function (b) {
    b.addEventListener('click', function () {
      openUrl('mailto:' + MU + '@' + MH + '?subject=' + encodeURIComponent('Contato pelo site workbenchdev.com') + '&body=' + encodeURIComponent('Olá! Gostaria de conversar sobre um projeto.'));
    });
  });

  /* ---------- Menu ---------- */
  var burger = $('#burger'), menu = $('#menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    root.style.overflow = open ? 'hidden' : '';
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.inert = !open;
    if (open) setTimeout(function () { var a = $('nav a', menu); if (a) a.focus({ preventScroll: true }); }, 500);
  }
  burger.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { if (a.getAttribute('href').charAt(0) === '#') setMenu(false); }); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); burger.focus(); } });

  /* ---------- Faixas em movimento ---------- */
  var mqs = $$('[data-mq]').map(function (tr) {
    var m = { tr: tr, g: tr.firstElementChild, x: 0, period: 0, dir: parseFloat(tr.getAttribute('data-mq')) < 0 ? -1 : 1, sp: Math.abs(parseFloat(tr.getAttribute('data-mq'))), f: 1, tf: 1 };
    var host = tr.parentNode;
    host.addEventListener('pointerenter', function () { m.tf = 0.25; });
    host.addEventListener('pointerleave', function () { m.tf = 1; });
    return m;
  });
  function fillMq() {
    mqs.forEach(function (m) {
      var need = Math.ceil(window.innerWidth * 1.4 / Math.max(1, m.g.offsetWidth)) + 2;
      while (m.tr.children.length < need) { var c = m.g.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.inert = true; m.tr.appendChild(c); }
      m.period = m.tr.children[1].offsetLeft - m.tr.children[0].offsetLeft;
      if (m.dir < 0 && m.x === 0) m.x = -m.period;
    });
  }

  /* ---------- Exemplos de projetos ---------- */
  var PROJ = [
    { s: 'Restaurante', t: 'Reservas online e cardápio', k: 'landing', a: '#74f787', b: '#f3ff7d', v: 'Landing pages' },
    { s: 'Clínica', t: 'Site com agendamento de consultas', k: 'site', a: '#7dd3ff', b: '#74f787', v: 'Sites' },
    { s: 'Loja de roupas', t: 'Vitrine com pedido pelo WhatsApp', k: 'site', a: '#ffb37d', b: '#f3ff7d', v: 'Sites' },
    { s: 'Construtora', t: 'Página de lançamento de empreendimento', k: 'landing', a: '#c7a6ff', b: '#7dd3ff', v: 'Landing pages' },
    { s: 'Empresa de serviços', t: 'Painel de pedidos e clientes', k: 'app', a: '#74f787', b: '#7dd3ff', v: 'Web apps' },
    { s: 'Academia', t: 'Área do aluno com login', k: 'app', a: '#f3ff7d', b: '#ffb37d', v: 'Web apps' }
  ];
  var bars = function (h) { return h.map(function (x) { return '<i style="height:' + x + '%"></i>'; }).join(''); };
  var VIZ = {
    site: '<div class="wbar"><i></i><i></i><i></i></div><div class="wbody"><div class="row2"><div><span class="bx bt" style="width:90%"></span><span class="bx bt" style="width:62%"></span><span class="bx" style="width:80%"></span><span class="bx bg" style="width:44%;height:12px"></span></div><div class="imgx"></div></div><div class="tls"><i></i><i></i><i></i></div></div>',
    landing: '<div class="wbar"><i></i><i></i><i></i></div><div class="wbody center"><span class="bx bt" style="width:74%"></span><span class="bx bt" style="width:48%"></span><span class="bx" style="width:66%"></span><span class="pillx"></span><div class="tls" style="width:100%"><i></i><i></i><i></i></div></div>',
    app: '<div class="wbar"><i></i><i></i><i></i></div><div class="wbody"><div class="appx"><div class="sd"><i></i><i></i><i></i><i></i></div><div class="mn"><span class="bx bt" style="width:50%"></span><div class="kpi"><i></i><i></i><i></i></div><div class="chartx">' + bars([40, 62, 48, 85, 66, 92]) + '</div></div></div></div>'
  };
  var rail = $('#rail');
  rail.innerHTML = PROJ.map(function (p) {
    return '<article class="card" style="--a:' + p.a + ';--b:' + p.b + '"><div class="viz"><div class="win">' + VIZ[p.k] + '</div></div><div class="cinfo"><small>' + p.s + '</small><h3>' + p.t + '</h3><span class="svc">' + p.v + '</span></div></article>';
  }).join('');
  var railBar = $('#railBar');
  function railProg() { var m = rail.scrollWidth - rail.clientWidth; railBar.style.transform = 'scaleX(' + (0.15 + 0.85 * (m > 0 ? rail.scrollLeft / m : 0)) + ')'; }
  rail.addEventListener('scroll', railProg, { passive: true });
  function step(d) { var c = $('.card', rail); rail.scrollBy({ left: d * (c.offsetWidth + 20), behavior: reduce ? 'auto' : 'smooth' }); }
  $('#prev').addEventListener('click', function () { step(-1); });
  $('#next').addEventListener('click', function () { step(1); });
  (function () {
    var down = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = rail.scrollLeft; moved = 0; });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
      if (moved > 4) { rail.classList.add('drag'); rail.scrollLeft = sl - dx; }
    });
    window.addEventListener('pointerup', function () { if (!down) return; down = false; rail.classList.remove('drag'); });
  })();

  /* ---------- Perguntas ---------- */
  $$('.q').forEach(function (q) {
    q.addEventListener('click', function () {
      var open = q.getAttribute('aria-expanded') === 'true';
      q.setAttribute('aria-expanded', !open); q.parentNode.classList.toggle('open', !open);
    });
  });

  /* ---------- Inclinação do notebook e botões magnéticos ---------- */
  var hv = $('#hv'), lap = $('#laptop'), tx = 0, ty = 0, rx = 0, ry = 0;
  if (fine && !reduce) {
    hv.parentNode.parentNode.addEventListener('pointermove', function (e) {
      var r = hv.getBoundingClientRect();
      ty = clamp((e.clientX - (r.left + r.width / 2)) / window.innerWidth, -0.5, 0.5);
      tx = clamp((e.clientY - (r.top + r.height / 2)) / window.innerHeight, -0.5, 0.5);
    });
    $$('.mag').forEach(function (m) {
      m.addEventListener('pointermove', function (e) {
        var r = m.getBoundingClientRect();
        m.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.22) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.3) + 'px)';
      });
      m.addEventListener('pointerleave', function () { m.style.transform = ''; });
    });
  }

  /* ---------- Laço principal ---------- */
  var hd = $('#hd'), prog = $('#prog'), lastY = window.pageYOffset, vel = 0, last = performance.now();
  function loop(t) {
    var dt = Math.min(0.05, (t - last) / 1000); last = t;
    var y = window.pageYOffset, dy = y - lastY; lastY = y;
    vel = vel * 0.9 + Math.abs(dy) * 0.1;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    prog.style.transform = 'scaleX(' + clamp(y / max, 0, 1) + ')';
    hd.classList.toggle('solid', y > 40);
    if (!body.classList.contains('menu-open')) { if (y > 160 && dy > 3) hd.classList.add('hide'); else if (dy < -3 || y < 160) hd.classList.remove('hide'); }
    if (!reduce) {
      mqs.forEach(function (m) {
        if (!m.period) return;
        m.f += (m.tf - m.f) * 0.08;
        m.x -= m.dir * (m.sp + vel * 12) * m.f * dt;
        if (m.dir > 0 && m.x <= -m.period) m.x += m.period;
        if (m.dir < 0 && m.x >= 0) m.x -= m.period;
        m.tr.style.transform = 'translate3d(' + m.x + 'px,0,0)';
      });
      rx += (tx * -10 - rx) * 0.08; ry += (ty * 14 - ry) * 0.08;
      lap.style.setProperty('--rx', rx.toFixed(2) + 'deg'); lap.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    }
    requestAnimationFrame(loop);
  }
  function onResize() { fillMq(); fixGrad(); railProg(); }
  window.addEventListener('resize', onResize);
  onResize();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(onResize);
  requestAnimationFrame(loop);
})();
