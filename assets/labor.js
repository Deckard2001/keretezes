/* Keretezés-labor – három klasszikus kísérlet órai változata.
 * A hallgatói felületet (mountStudent) és a kivetítő kártyáit (Board) is ez a fájl rajzolja.
 * 1. Iyengar (1991) – 2. Fiske et al. (2002) – 3. Tajfel et al. (1971)
 */
(function (global) {
  'use strict';

  // ---- 1. kör: Iyengar (1991), epizodikus vs. tematikus keret ------------
  var R1 = {
    A: 'Kovács Anikó 34 éves, két gyereket nevel egyedül egy északkelet-magyarországi faluban. Tavaly elvesztette a munkáját a közeli üzemben, azóta alkalmi munkákból él. Télen gyakran választania kell a fűtés és az élelmiszer között, a gyerekek osztálykirándulására nem jut pénz.',
    B: 'Magyarországon a szegénység kockázata erősen függ a lakóhelytől: az északkeleti megyékben és a kistelepüléseken többszöröse a fővárosinak. A helyi munkahelyek hiánya, a gyenge közlekedés és az iskolák eltérő színvonala miatt a hátrány gyakran nemzedékeken át öröklődik.'
  };
  var R1_Q = ['Mennyire felelősek a szegény emberek a saját helyzetükért?',
              'Mennyire az állam feladata, hogy javítson a helyzetükön?'];

  // ---- 2. kör: Fiske et al. (2002), sztereotípia-tartalom modell -------------
  // A csoportlista szabadon szerkeszthető. A [rátermettség, barátságosság] a demóadatok várható értéke (1–5).
  var R2_GROUPS = [
    { t: 'Orvosok', d: [4.5, 3.8] }, { t: 'Ápolók', d: [3.6, 4.4] },
    { t: 'Nyugdíjasok', d: [2.4, 4.1] }, { t: 'Fogyatékkal élők', d: [2.2, 4.0] },
    { t: 'Gazdag vállalkozók', d: [4.3, 2.0] }, { t: 'Politikusok', d: [3.5, 1.7] },
    { t: 'Munkanélküliek', d: [2.0, 2.6] }, { t: 'Hajléktalanok', d: [1.6, 2.2] }
  ];
  var AX_X = 'Rátermettség', AX_Y = 'Barátságosság';

  // ---- 3. kör: Tajfel (1971), minimális csoport -----------------------------
  // [saját csoportbeli társ, másik csoportbeli társ]. Az első mindkettőnek a legjobb.
  var R3_OPTS = [[13, 13], [11, 9], [9, 5], [7, 1]];
  var GROUPS = { A: 'Zöld', B: 'Lila' };
  var GCOL = { A: '#2E8556', B: '#7A5CC2' };

  var ORIGINAL = {
    r1: 'Iyengar (1991): az egyéni történetet bemutató (epizodikus) keret után a résztvevők inkább az érintetteket tették felelőssé, a statisztikai-szerkezeti (tematikus) keret után inkább a társadalmat és a kormányzatot.',
    r2: 'Fiske, Cuddy, Glick és Xu (2002): a válaszadók a társadalmi csoportokat két dimenzió mentén ítélték meg – barátságosság (az eredeti szóhasználatban „melegség”: jó szándékú, megbízható-e a csoport) és rátermettség („kompetencia”). A csoportok négy kupacba rendeződtek, és mindegyikhez jellegzetes érzelem tartozik: csodálat (barátságos és rátermett, pl. a középosztály), sajnálat (barátságos, de nem tartják rátermettnek, pl. idősek, fogyatékkal élők), irigység (rátermett, de nem barátságos, pl. gazdagok, szakemberek) és megvetés (egyik sem, pl. szegények, hajléktalanok). A rátermettséget főleg a csoport státusza, a barátságosságot az jósolja, hogy versenytársnak látjuk-e. Harris és Fiske (2006) agyi képalkotó vizsgálatában a megvetett csoportok képei alig aktiválták a társas megismeréshez kapcsolódó agyterületet.',
    r3: 'Tajfel és munkatársai (1971): a puszta, jelentéktelen alapon létrehozott csoportok tagjai is a saját csoportot részesítették előnyben, és gyakran a nagyobb különbséget választották – akkor is, ha ezzel a saját csoporttársuk is kevesebbet kapott. A beosztás nálunk is véletlenszerű volt, nem a képválasztástól függött.'
  };

  function coin() { return Math.random() < 0.5 ? 'A' : 'B'; }
  function assign() { return { r1: coin(), grp: coin() }; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---- összesítés -----------------------------------------------------------
  function mean(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }
  function pct(a, f) { return a.length ? 100 * a.filter(f).length / a.length : null; }

  function aggregate(rows) {
    var by = function (key, v) { return rows.filter(function (r) { return r.v && r.v[key] === v; }); };
    var out = { n: rows.length };
    out.r1 = ['A', 'B'].map(function (v) {
      var g = by('r1', v);
      return { n: g.length, own: mean(g.map(function (r) { return r.r1[0]; })), state: mean(g.map(function (r) { return r.r1[1]; })) };
    });
    out.r2 = R2_GROUPS.map(function (gr, i) {
      var pts = rows.map(function (r) { return r.r2 && r.r2[i]; }).filter(function (p) { return p && p[0] && p[1]; });
      return { t: gr.t, n: pts.length, x: mean(pts.map(function (p) { return p[0]; })), y: mean(pts.map(function (p) { return p[1]; })) };
    });
    var ch = rows.map(function (r) { return r.r3; }).filter(function (c) { return c >= 1 && c <= 4; });
    var hist = [0, 0, 0, 0]; ch.forEach(function (c) { hist[c - 1]++; });
    out.r3 = { n: ch.length, hist: hist, fair: pct(ch, function (c) { return c === 1; }),
               adv: mean(ch.map(function (c) { return R3_OPTS[c - 1][0] - R3_OPTS[c - 1][1]; })) };
    return out;
  }

  function demoRows(n) {
    var rows = [];
    var jit = function (m) { return Math.max(1, Math.min(7, Math.round(m + (Math.random() - 0.5) * 3))); };
    for (var i = 0; i < n; i++) {
      var v = assign();
      var j5 = function (m) { return Math.max(1, Math.min(5, Math.round(m + (Math.random() - 0.5) * 2.2))); };
      var r2 = R2_GROUPS.map(function (g) { return [j5(g.d[0]), j5(g.d[1])]; });
      var u = Math.random(), r3 = u < 0.5 ? 1 : u < 0.75 ? 2 : u < 0.9 ? 3 : 4;
      rows.push({ id: 'demo' + i, v: v, r1: [jit(v.r1 === 'A' ? 4.3 : 3.2), jit(v.r1 === 'A' ? 4.4 : 5.3)], r2: r2, r3pref: coin(), r3: r3 });
    }
    return rows;
  }

  // ---- hallgatói felület ------------------------------------------------------
  function instr(html) { return '<div class="instr"><span class="instr-lab">Mit kell tenned?</span>' + html + '</div>'; }

  function mountStudent(root, v, onFinish) {
    var ans = { v: v, r1: [null, null], r2: R2_GROUPS.map(function () { return null; }), r3pref: null, r3: null };
    var steps = [];
    root.innerHTML = '';
    function el(html) { var d = document.createElement('section'); d.innerHTML = html; d.hidden = true; root.appendChild(d); steps.push(d); return d; }
    function show(i) { steps.forEach(function (s, j) { s.hidden = i !== j; }); window.scrollTo(0, 0); }

    // 0. bevezető
    var s0 = el('<h1>Három döntés</h1>' +
      '<p>Három rövid feladat következik. Mindegyik előtt leírjuk, pontosan mit kell tenned. Nincs jó vagy rossz válasz, és nem a tudásodat mérjük: arra vagyunk kíváncsiak, mit gondolsz.</p>' +
      '<p class="note-strong">Fontos: a szomszédod lehet, hogy más szöveget kap, mint te. Amíg mindenki nem végzett, ne beszéljétek meg a feladatokat, és ne nézzetek egymás telefonjára.</p>' +
      '<p class="muted">Kb. 3 perc, névtelen.</p><p style="margin-top:24px"><button class="btn-primary">Kezdés</button></p>');
    s0.querySelector('button').addEventListener('click', function () { show(1); });

    // 1. szegénység
    var s1 = el('<div class="step">1. feladat / 3</div>' +
      instr('Olvasd el a rövid szöveget. Utána mindkét kérdésre válaszolj egy 1-től 7-ig terjedő skálán: <b>1 = egyáltalán nem</b>, <b>7 = teljes mértékben</b>.') +
      '<blockquote class="text-card"></blockquote><div class="scales"></div>' +
      '<p class="hint" hidden>Mindkét kérdésre válaszolj a továbblépéshez.</p>' +
      '<p style="margin-top:18px"><button class="btn-primary" disabled>Tovább</button></p>');
    s1.querySelector('.text-card').textContent = R1[v.r1];
    var next1 = s1.querySelector('.btn-primary');
    R1_Q.forEach(function (q, qi) {
      var w = document.createElement('div'); w.className = 'scale-q';
      w.innerHTML = '<p class="prompt"><span class="qn">' + (qi + 1) + '.</span> <span></span></p><div class="scale7"></div><div class="scale-ends"><span>1 = egyáltalán nem</span><span>7 = teljes mértékben</span></div>';
      w.querySelector('.prompt span:last-child').textContent = q;
      for (var k = 1; k <= 7; k++) (function (k) {
        var b = document.createElement('button'); b.textContent = k; b.setAttribute('aria-label', q + ' – ' + k);
        b.addEventListener('click', function () {
          Array.prototype.forEach.call(b.parentNode.children, function (c) { c.classList.remove('selected'); });
          b.classList.add('selected'); ans.r1[qi] = k; next1.disabled = !(ans.r1[0] && ans.r1[1]);
        });
        w.querySelector('.scale7').appendChild(b);
      })(k);
      s1.querySelector('.scales').appendChild(w);
    });
    next1.addEventListener('click', function () { show(2); });

    // 2. csoportok elhelyezése (sztereotípia-tartalom modell)
    var s2 = el('<div class="step"></div>' +
      instr('<b>Szerinted hogyan látja ezt a csoportot a magyar társadalom?</b> (Nem a saját véleményed számít.) ' +
        'Koppints a négyzetben: <b>jobbra</b> = rátermettebbnek látják, <b>fent</b> = barátságosabbnak látják.') +
      '<p class="grp-name"></p>' +
      '<div class="spot"><div class="spot-y-top">▲ barátságosabb</div>' +
      '<div class="spot-grid" role="group"></div>' +
      '<div class="spot-y-bot">▼ kevésbé barátságos</div>' +
      '<div class="spot-x"><span>◄ kevésbé rátermett</span><span>rátermettebb ►</span></div></div>' +
      '<p style="margin-top:14px"><button class="btn-quiet back2">Vissza az előző csoporthoz</button></p>');
    var gi = 0, gridEl = s2.querySelector('.spot-grid');
    function drawGroup() {
      s2.querySelector('.step').textContent = '2. feladat / 3 · ' + (gi + 1) + '. csoport a ' + R2_GROUPS.length + '-ból';
      s2.querySelector('.grp-name').textContent = R2_GROUPS[gi].t;
      s2.querySelector('.back2').style.visibility = gi === 0 ? 'hidden' : 'visible';
      gridEl.innerHTML = '';
      for (var y = 5; y >= 1; y--) for (var x = 1; x <= 5; x++) (function (x, y) {
        var c = document.createElement('button'); c.className = 'spot-cell';
        c.setAttribute('aria-label', R2_GROUPS[gi].t + ': rátermettség ' + x + ', barátságosság ' + y);
        var cur = ans.r2[gi]; if (cur && cur[0] === x && cur[1] === y) c.classList.add('selected');
        c.addEventListener('click', function () {
          Array.prototype.forEach.call(gridEl.children, function (k) { k.classList.remove('selected'); });
          c.classList.add('selected'); ans.r2[gi] = [x, y];
          setTimeout(function () { if (gi < R2_GROUPS.length - 1) { gi++; drawGroup(); window.scrollTo(0, 0); } else { show(3); } }, 250);
        });
        gridEl.appendChild(c);
      })(x, y);
    }
    s2.querySelector('.back2').addEventListener('click', function () { if (gi > 0) { gi--; drawGroup(); } });
    drawGroup();

    // 3a. képválasztás
    var s3 = el('<div class="step">3. feladat / 3 – első lépés</div>' +
      instr('Nézd meg a két képet, és koppints arra, amelyik <b>jobban tetszik</b>. Ez alapján csoportba kerülsz.') +
      '<div class="paintings">' + PAINT_A + PAINT_B + '</div>');
    Array.prototype.forEach.call(s3.querySelectorAll('.painting'), function (b) {
      b.addEventListener('click', function () { ans.r3pref = b.getAttribute('data-p'); buildAlloc(); show(4); });
    });

    // 3b. pontelosztás
    var s4 = el('<div class="step">3. feladat / 3 – második lépés</div>' +
      '<p class="scenario">A választásod alapján a <span class="grp-badge"></span> csoportba kerültél.</p>' +
      instr('Most te osztasz pontot <b>két másik, névtelen résztvevőnek</b>. Te magad nem kapsz pontot.' +
        '<ul class="instr-list"><li class="li-own"></li><li class="li-oth"></li></ul>' +
        'Alább négy lehetséges elosztás van. Koppints arra, amelyiket választod.') +
      '<div class="alloc"></div><p style="margin-top:18px"><button class="btn-primary" disabled>Befejezés</button></p>');
    var done = s4.querySelector('.btn-primary');
    function buildAlloc() {
      var own = v.grp, oth = v.grp === 'A' ? 'B' : 'A';
      var badge = s4.querySelector('.grp-badge'); badge.textContent = GROUPS[own].toUpperCase(); badge.style.background = GCOL[own];
      var liOwn = s4.querySelector('.li-own'), liOth = s4.querySelector('.li-oth');
      liOwn.innerHTML = '<i style="background:' + GCOL[own] + '"></i><span></span>';
      liOwn.lastChild.textContent = 'Az egyik a te csoportodból való (' + GROUPS[own] + ').';
      liOth.innerHTML = '<i style="background:' + GCOL[oth] + '"></i><span></span>';
      liOth.lastChild.textContent = 'A másik a másik csoportból (' + GROUPS[oth] + ').';
      var box = s4.querySelector('.alloc'); box.innerHTML = '';
      R3_OPTS.forEach(function (o, i) {
        var b = document.createElement('button'); b.className = 'alloc-opt';
        b.innerHTML =
          '<div class="ap"><span class="who"></span><span class="bar"><i style="width:' + (o[0] / 13 * 100) + '%;background:' + GCOL[own] + '"></i></span><b>' + o[0] + ' pont</b></div>' +
          '<div class="ap"><span class="who"></span><span class="bar"><i style="width:' + (o[1] / 13 * 100) + '%;background:' + GCOL[oth] + '"></i></span><b>' + o[1] + ' pont</b></div>';
        b.querySelectorAll('.who')[0].textContent = GROUPS[own] + ' társ (a te csoportod)';
        b.querySelectorAll('.who')[1].textContent = GROUPS[oth] + ' társ (a másik csoport)';
        b.setAttribute('aria-label', GROUPS[own] + ' társ ' + o[0] + ' pont, ' + GROUPS[oth] + ' társ ' + o[1] + ' pont');
        b.addEventListener('click', function () {
          Array.prototype.forEach.call(box.children, function (c) { c.classList.remove('selected'); });
          b.classList.add('selected'); ans.r3 = i + 1; done.disabled = false;
        });
        box.appendChild(b);
      });
    }
    done.addEventListener('click', function () { show(5); onFinish(ans, s5.querySelector('.status')); });

    var s5 = el('<h1>Kész, köszönjük!</h1><p class="status"></p><p>Kérjük, továbbra se mondd el senkinek, milyen szöveget kaptál. Nézz a kivetítőre.</p>');
    show(0);
  }

  var PAINT_A = '<button class="painting" data-p="A" aria-label="A kép"><svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="#F3EBDD"/><circle cx="62" cy="58" r="34" fill="#2D5A9A"/><circle cx="62" cy="58" r="18" fill="#E0B13A"/><circle cx="146" cy="96" r="22" fill="none" stroke="#1C2333" stroke-width="4"/><line x1="20" y1="128" x2="180" y2="22" stroke="#1C2333" stroke-width="3"/><line x1="104" y1="18" x2="176" y2="140" stroke="#C0392B" stroke-width="5"/><polygon points="118,40 150,30 140,62" fill="#C0392B"/><circle cx="160" cy="38" r="7" fill="#1C2333"/></svg><span>A kép</span></button>';
  var PAINT_B = '<button class="painting" data-p="B" aria-label="B kép"><svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="#EDE6D3"/><g opacity=".9"><rect x="16" y="16" width="36" height="28" fill="#C8741E"/><rect x="56" y="16" width="30" height="28" fill="#7A9A5C"/><rect x="90" y="16" width="44" height="28" fill="#A8325E"/><rect x="138" y="16" width="46" height="28" fill="#D9C27A"/><rect x="16" y="48" width="50" height="34" fill="#5E7FA8"/><rect x="70" y="48" width="34" height="34" fill="#D9C27A"/><rect x="108" y="48" width="40" height="34" fill="#C8741E"/><rect x="152" y="48" width="32" height="34" fill="#7A9A5C"/><rect x="16" y="86" width="30" height="48" fill="#A8325E"/><rect x="50" y="86" width="56" height="48" fill="#EDC17A"/><rect x="110" y="86" width="30" height="48" fill="#5E7FA8"/><rect x="144" y="86" width="40" height="48" fill="#C8741E"/></g><path d="M30 110 L60 70 L90 112 L120 66 L160 118" fill="none" stroke="#1C2333" stroke-width="3"/><circle cx="160" cy="34" r="9" fill="#1C2333"/></svg><span>B kép</span></button>';

  // ---- kivetítő ----------------------------------------------------------------
  var ROUND_INFO = {
    1: { title: '1. A szegénység', sub: 'A csoport fele egy anya történetét olvasta, a másik fele területi statisztikát. A kérdések ugyanazok voltak.' },
    2: { title: '2. Hogyan látja őket a társadalom?', sub: 'Mindenki elhelyezte a csoportokat két tengelyen: mennyire látják őket rátermettnek, és mennyire barátságosnak. A pontok a csoport átlagai.' },
    3: { title: '3. A Zöldek és a Lilák', sub: 'Mindenki két névtelen társ között osztott pontot: egy saját és egy másik csoportbeli között. A 13–13 mindkettőnek a legjobb.' }
  };
  function fmt(x, d) { return x == null ? '–' : x.toFixed(d == null ? 0 : d).replace('.', ','); }
  function bar(label, value, max, sub, cls) {
    var w = value == null ? 0 : Math.max(0, Math.min(100, value / max * 100));
    return '<div class="hbar ' + (cls || '') + '"><div class="hbar-lab">' + label + '</div><div class="hbar-track"><div class="hbar-fill" style="width:' + w + '%"></div></div><div class="hbar-val">' + sub + '</div></div>';
  }
  function scmSVG(pts) {
    var W = 420, P = 34, S = W - 2 * P;
    var X = function (v) { return P + (v - 1) / 4 * S; }, Y = function (v) { return P + (5 - v) / 4 * S; };
    var h = '<svg class="scm" viewBox="0 0 ' + W + ' ' + W + '" role="img" aria-label="A csoportok átlagos helye a rátermettség és a barátságosság tengelyén">';
    h += '<rect x="' + P + '" y="' + P + '" width="' + S + '" height="' + S + '" class="scm-bg"/>';
    h += '<line x1="' + X(3) + '" y1="' + P + '" x2="' + X(3) + '" y2="' + (P + S) + '" class="scm-mid"/><line x1="' + P + '" y1="' + Y(3) + '" x2="' + (P + S) + '" y2="' + Y(3) + '" class="scm-mid"/>';
    [['Sajnálat', P + 8, P + 18, 'start'], ['Csodálat', P + S - 8, P + 18, 'end'], ['Megvetés', P + 8, P + S - 10, 'start'], ['Irigység', P + S - 8, P + S - 10, 'end']].forEach(function (q) {
      h += '<text class="ql" x="' + q[1] + '" y="' + q[2] + '" text-anchor="' + q[3] + '">' + q[0] + '</text>';
    });
    h += '<text class="scm-ax" x="' + (P + S / 2) + '" y="' + (W - 8) + '" text-anchor="middle">rátermettség →</text>';
    h += '<text class="scm-ax" x="12" y="' + (P + S / 2) + '" text-anchor="middle" transform="rotate(-90 12 ' + (P + S / 2) + ')">barátságosság →</text>';
    var labs = [];
    pts.forEach(function (p) {
      if (p.x == null) return;
      var cx = X(p.x), cy = Y(p.y), right = cx < P + S * 0.62, w = p.t.length * 7.6;
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="7" class="scm-dot"/>';
      labs.push({ t: p.t, x: cx + (right ? 10 : -10), y: cy + 5, x0: right ? cx + 10 : cx - 10 - w, x1: right ? cx + 10 + w : cx - 10, a: right ? 'start' : 'end' });
    });
    for (var it = 0; it < 60; it++) {          // egymásra lógó feliratok széthúzása
      var moved = false;
      for (var i = 0; i < labs.length; i++) for (var j = i + 1; j < labs.length; j++) {
        var A = labs[i], B = labs[j];
        if (A.x1 < B.x0 || B.x1 < A.x0) continue;
        var dy = B.y - A.y; if (Math.abs(dy) >= 16) continue;
        var push = (16 - Math.abs(dy)) / 2, d = dy >= 0 ? 1 : -1;
        A.y -= push * d; B.y += push * d; moved = true;
      }
      if (!moved) break;
    }
    labs.forEach(function (l) { h += '<text class="scm-lab" x="' + l.x + '" y="' + l.y + '" text-anchor="' + l.a + '">' + esc(l.t) + '</text>'; });
    return h + '</svg>';
  }

  function resultsHTML(a) {
    var R = {};
    R[1] = '<p class="res-q">„Mennyire felelősek a saját helyzetükért?” (átlag, 1–7)</p>' +
      bar('anya története', a.r1[0].own, 7, fmt(a.r1[0].own, 1) + ' <small>n=' + a.r1[0].n + '</small>', 'c1') +
      bar('statisztika', a.r1[1].own, 7, fmt(a.r1[1].own, 1) + ' <small>n=' + a.r1[1].n + '</small>', 'c2') +
      '<p class="res-q">„Mennyire az állam feladata?” (átlag, 1–7)</p>' +
      bar('anya története', a.r1[0].state, 7, fmt(a.r1[0].state, 1), 'c1') + bar('statisztika', a.r1[1].state, 7, fmt(a.r1[1].state, 1), 'c2');
    R[2] = scmSVG(a.r2);
    var n3 = Math.max(1, a.r3.n);
    R[3] = '<p class="res-q">Melyik elosztást választották? (saját csoportbeli – másik csoportbeli társ)</p>' +
      R3_OPTS.map(function (o, i) {
        var lab = o[0] + ' – ' + o[1] + (i === 0 ? ' <small>mindkettőnek a legtöbb</small>' : i === 3 ? ' <small>a legnagyobb különbség</small>' : '');
        return bar(lab, 100 * a.r3.hist[i] / n3, 100, fmt(100 * a.r3.hist[i] / n3) + '% <small>' + a.r3.hist[i] + ' fő</small>', i === 0 ? 'c3' : 'c1');
      }).join('') +
      '<div class="r4stats"><div><b>' + fmt(a.r3.fair == null ? null : 100 - a.r3.fair) + '%</b><span>nem a 13–13-at választotta: a saját csoporttársától is elvett pontot, hogy a másik még kevesebbet kapjon</span></div>' +
      '<div><b>+' + fmt(a.r3.adv, 1) + '</b><span>ponttal kapott átlagosan többet a saját csoportbeli társ – egy véletlenszerű beosztás alapján</span></div></div>';
    return R;
  }
  function youText(r, m) {
    if (!m) return '';
    var V = m.v;
    if (r === 1) return 'Te <b>' + (V.r1 === 'A' ? 'az anya történetét' : 'a statisztikát') + '</b> olvastad. Felelősség: <b>' + m.r1[0] + '</b>, állam: <b>' + m.r1[1] + '</b>.';
    if (r === 2) { var hm = R2_GROUPS.map(function (g, i) { return m.r2[i] ? g.t.toLowerCase() + ' (' + m.r2[i][0] + '; ' + m.r2[i][1] + ')' : null; }).filter(Boolean);
      return 'A te elhelyezéseid (rátermettség; barátságosság): ' + esc(hm.join(', ')) + '.'; }
    var o = R3_OPTS[m.r3 - 1];
    return 'Te a <b>' + GROUPS[V.grp] + '</b> csoportba kerültél – véletlenszerűen, nem a képválasztás alapján –, és a <b>' + o[0] + ' – ' + o[1] + '</b> elosztást választottad.';
  }

  function Board(root) {
    root.innerHTML = '';
    var cards = [1, 2, 3].map(function (r) {
      var sec = document.createElement('section'); sec.className = 'round';
      sec.innerHTML = '<h2></h2><p class="muted"></p><div class="res" hidden></div>' +
        '<div class="actions"><button class="btn-primary reveal">Eredmény mutatása</button><button class="btn-outline orig" hidden>Az eredeti kísérlet</button></div>' +
        '<p class="orig-text" hidden></p><p class="you"></p>';
      sec.querySelector('h2').textContent = ROUND_INFO[r].title;
      sec.querySelector('.muted').textContent = ROUND_INFO[r].sub;
      sec.querySelector('.orig-text').textContent = ORIGINAL['r' + r];
      sec.querySelector('.reveal').addEventListener('click', function () {
        sec.querySelector('.res').hidden = false; this.hidden = true; sec.querySelector('.orig').hidden = false; update();
      });
      sec.querySelector('.orig').addEventListener('click', function () { sec.querySelector('.orig-text').hidden = false; this.hidden = true; sec.classList.add('orig-shown'); });
      root.appendChild(sec); return sec;
    });
    var last = [], mine = null;
    function update() {
      var R = resultsHTML(aggregate(last));
      cards.forEach(function (sec, i) {
        sec.querySelector('.res').innerHTML = R[i + 1];
        sec.querySelector('.you').innerHTML = (!sec.querySelector('.res').hidden && mine) ? youText(i + 1, mine) : '';
      });
    }
    return {
      render: function (rows, me) { last = rows; mine = me || null; update(); },
      reset: function () {
        cards.forEach(function (sec) {
          sec.querySelector('.res').hidden = true; sec.querySelector('.reveal').hidden = false;
          sec.querySelector('.orig').hidden = true; sec.querySelector('.orig-text').hidden = true; sec.classList.remove('orig-shown');
        });
      }
    };
  }

  function csv(rows) {
    var head = ['azonosito', 'szegenyseg_valtozat', 'felelos_1_7', 'allam_1_7'];
    R2_GROUPS.forEach(function (g, i) { head.push('cs' + (i + 1) + '_ratermettseg', 'cs' + (i + 1) + '_baratsagossag'); });
    head = head.concat(['csoport', 'kep', 'elosztas', 'sajat_pont', 'masik_pont']);
    var lines = ['# csoportok: ' + R2_GROUPS.map(function (g, i) { return 'cs' + (i + 1) + '=' + g.t; }).join('; '), head.join(',')];
    rows.forEach(function (r) {
      var o = R3_OPTS[r.r3 - 1] || ['', ''];
      var line = [r.id, r.v.r1 === 'A' ? 'tortenet' : 'statisztika', r.r1[0], r.r1[1]];
      R2_GROUPS.forEach(function (g, i) { var p = (r.r2 || [])[i] || ['', '']; line.push(p[0], p[1]); });
      lines.push(line.concat([GROUPS[r.v.grp], r.r3pref, r.r3, o[0], o[1]]).join(','));
    });
    return lines.join('\n');
  }

  global.Labor = { assign: assign, aggregate: aggregate, demoRows: demoRows, mountStudent: mountStudent, Board: Board, csv: csv };
})(window);
