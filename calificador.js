/* Formulario calificador · STM LATAM y Julio Cardozo Ferrer
   Reemplaza el contenido de <form data-calificador> por preguntas en pasos.
   Calificado  -> gracias.html?c=1 (muestra la agenda, cuenta como conversión)
   No calificado -> gracias.html?c=0 (motivo obligatorio, te contactamos)            */
(function () {
  var f = document.querySelector('form[data-calificador]');
  if (!f) return;

  var WA = '5491123745576';
  var DECISOR_MULTI = ['Director/a', 'Gerente', 'Jefe/a'];
  var AREAS = {
    'Trade Marketing': ['Ejecución en el punto de venta', 'Exhibición y planogramas', 'Inversión en trade sin retorno medible', 'Relevamiento y auditoría de góndola', 'Estructura del área de Trade Marketing'],
    'Comercial / Ventas': ['Distribuidores que no rinden', 'Cobertura y Route to Market', 'Reestructuración de la fuerza de ventas', 'Procesos e indicadores comerciales', 'Entrada a nuevos canales'],
    'Marketing / Categoría': ['Estudio de mercado', 'Censo de puntos de venta', 'Category management', 'Lanzamiento de producto'],
    'Dirección / Gerencia general': ['Reestructuración comercial', 'Entrada a nuevos canales o mercados', 'Estrategia comercial', 'Estudio de mercado'],
    'Otra área': []
  };
  var PYME = ['Tengo problemas de ventas', 'Necesito reestructurar mi equipo de ventas', 'Quiero lanzar un producto', 'Quiero entrar a supermercados, mayoristas o distribuidores', 'Necesito ordenar precios y márgenes'];
  var EMPLEADOS = ['Menos de 50', 'Más de 50', 'Más de 100', 'Más de 500', 'Más de 1.000'];

  var css = document.createElement('style');
  css.textContent =
    'form[data-calificador]{display:block!important}' +
    '.cq{display:grid;gap:10px;margin:0 0 20px}.cq[hidden]{display:none}' +
    '.cq>b{font-size:15px;font-weight:700;color:inherit}.cq small{font-weight:400;opacity:.7}' +
    '.cq .ops{display:flex;flex-wrap:wrap;gap:8px}' +
    '.cq .op{position:relative;display:inline-flex!important;align-items:center;gap:0!important;cursor:pointer;margin:0}' +
    '.cq .op input{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none}' +
    '.cq .op span{display:block;padding:10px 14px;border:1px solid rgba(15,20,36,.22);border-radius:999px;font-size:14px;font-weight:500;line-height:1.3;color:#0f1424;background:#fff;transition:background .15s,border-color .15s,color .15s}' +
    '.cq .op input:checked+span{background:#12213b;border-color:#12213b;color:#fff}' +
    '.cq .op input:focus-visible+span{outline:2px solid #4ea8de;outline-offset:2px}' +
    '.cq .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 16px}' +
    '.cq .grid label{display:grid;gap:6px;font-size:13px;font-weight:600}' +
    '.cq input[type=text],.cq input[type=email],.cq input[type=tel],.cq textarea{font:400 16px inherit;width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid rgba(15,20,36,.2);border-radius:10px;background:#fff;color:#0f1424}' +
    '.cq textarea{min-height:96px;resize:vertical}.cq .full{grid-column:1/-1}' +
    '.cq .nota{font-size:13px;padding:10px 12px;border-radius:10px;background:#eaf3fb;color:#12213b}' +
    '.cq-err{color:#b3261e;font-size:14px;margin:0 0 10px}' +
    '@media(max-width:640px){.cq .grid{grid-template-columns:1fr}}';
  document.head.appendChild(css);

  var hp = f.querySelector('.hp'), err = f.querySelector('.form-err'), legal = f.querySelector('.legal');
  var title = f.querySelector('h3'), formName = f.querySelector('[name="form-name"]');
  var origen = f.querySelector('[name=origen]'), campana = f.querySelector('[name=campana]');
  var waBtn = f.querySelector('a[href*="wa.me"]');

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ops(name, list, type) {
    return '<div class="ops">' + list.map(function (v) {
      return '<label class="op"><input type="' + (type || 'radio') + '" name="' + name + '" value="' + esc(v) + '"><span>' + esc(v) + '</span></label>';
    }).join('') + '</div>';
  }

  f.innerHTML =
    (title ? '<h3 style="margin-bottom:18px">' + title.innerHTML + '</h3>' : '') +
    '<div class="cq" id="q1"><b>¿En qué tipo de empresa trabajás?</b>' + ops('tipo_empresa', ['Multinacional o gran empresa', 'Pyme grande o mediana']) + '</div>' +
    '<div class="cq" id="q2m" hidden><b>¿Cuál es tu cargo?</b>' + ops('cargo_nivel', ['Director/a', 'Gerente', 'Jefe/a', 'Analista o coordinador/a', 'Otro']) + '</div>' +
    '<div class="cq" id="q3m" hidden><b>¿En qué área trabajás?</b>' + ops('area', Object.keys(AREAS)) + '</div>' +
    '<div class="cq" id="q2p" hidden><b>¿Cuál es tu rol en la empresa?</b>' + ops('rol_pyme', ['Soy dueño/a o socio/a', 'Tengo un cargo de decisión (gerente o director/a)', 'Otro cargo']) + '</div>' +
    '<div class="cq" id="q4" hidden><b>¿Qué querés resolver? <small>(podés marcar más de uno)</small></b><div id="probs"></div></div>' +
    '<div class="cq" id="q5" hidden><b>¿Cuántos empleados tiene la empresa?</b>' + ops('empleados', EMPLEADOS) + '</div>' +
    '<div class="cq" id="q6" hidden><b>Tus datos</b><div class="grid">' +
      '<label>Nombre y apellido<input type="text" name="nombre" autocomplete="name" required></label>' +
      '<label>Empresa<input type="text" name="empresa" autocomplete="organization" required></label>' +
      '<label>Cargo<input type="text" name="cargo" autocomplete="organization-title" required></label>' +
      '<label>Email<input type="email" name="email" autocomplete="email" required></label>' +
      '<label class="full">WhatsApp<input type="tel" name="telefono" autocomplete="tel" placeholder="+54 9 11 ..." required></label>' +
      '<label class="full"><span id="motivoLbl">¿Algo más que quieras contarnos? (opcional)</span><textarea name="mensaje" id="motivo"></textarea></label>' +
    '</div></div>' +
    '<p class="cq-err" id="cqErr" hidden></p>';

  if (formName) f.appendChild(formName);
  if (hp) f.appendChild(hp);
  if (origen) f.appendChild(origen);
  if (campana) f.appendChild(campana);
  if (legal) f.appendChild(legal);
  var fb = document.createElement('div');
  fb.className = f.querySelector('.fb') ? 'fb' : 'fbtns';
  fb.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;margin-top:6px';
  fb.innerHTML = '<button class="btn mag solid" type="submit" id="cqSend" hidden>Enviar</button>';
  if (waBtn) fb.appendChild(waBtn);
  f.appendChild(fb);
  if (err) f.appendChild(err);

  var $ = function (id) { return document.getElementById(id); };
  var val = function (n) { var x = f.querySelector('[name="' + n + '"]:checked'); return x ? x.value : ''; };
  var checked = function (n) { return [].slice.call(f.querySelectorAll('[name="' + n + '"]:checked')).map(function (x) { return x.value; }); };
  var show = function (id, on) { $(id).hidden = !on; };
  var lastProbs = '';

  function renderProbs(list) {
    var key = list.join('|');
    if (key === lastProbs) return;
    lastProbs = key;
    $('probs').innerHTML = list.length
      ? ops('problemas', list.concat(['Otro']), 'checkbox')
      : '<p class="nota">Contanos abajo qué necesitás y te contactamos.</p>';
  }

  function calificado() {
    var t = val('tipo_empresa'), p = checked('problemas').filter(function (x) { return x !== 'Otro'; });
    if (t === 'Multinacional o gran empresa')
      return DECISOR_MULTI.indexOf(val('cargo_nivel')) > -1 && val('area') && val('area') !== 'Otra área' && p.length > 0;
    if (t === 'Pyme grande o mediana')
      return /dueño|decisión/.test(val('rol_pyme')) && val('empleados') && val('empleados') !== 'Menos de 50' && p.length > 0;
    return false;
  }

  function update() {
    var t = val('tipo_empresa'), multi = t === 'Multinacional o gran empresa', pyme = t === 'Pyme grande o mediana';
    show('q2m', multi); show('q3m', multi && !!val('cargo_nivel'));
    show('q2p', pyme);
    var area = val('area');
    var listo = (multi && area) || (pyme && val('rol_pyme'));
    if (listo) renderProbs(multi ? AREAS[area] : PYME);
    show('q4', !!listo);
    show('q5', !!listo && (checked('problemas').length > 0 || (multi && area === 'Otra área')));
    var fin = !$('q5').hidden && !!val('empleados');
    show('q6', fin); $('cqSend').hidden = !fin;
    var ok = calificado(), m = $('motivo');
    m.required = !ok;
    $('motivoLbl').textContent = ok ? '¿Algo más que quieras contarnos? (opcional)' : 'Contanos el motivo de tu consulta (obligatorio)';
    $('cqSend').textContent = ok ? 'Enviar y elegir horario' : 'Enviar consulta';
  }
  f.addEventListener('change', update);
  f.addEventListener('input', function (e) { if (e.target.name === 'mensaje') $('cqErr').hidden = true; });
  update();

  f.addEventListener('submit', function (ev) {
    ev.preventDefault(); ev.stopImmediatePropagation();
    var ok = calificado(), b = $('cqSend'), e2 = $('cqErr');
    e2.hidden = true; if (err) err.hidden = true;
    if (!ok && $('motivo').value.trim().length < 5) { e2.textContent = 'Por favor, contanos el motivo de tu consulta.'; e2.hidden = false; $('motivo').focus(); return; }
    if (!f.reportValidity()) return;
    var tel = (f.telefono.value || '').replace(/\D/g, '');
    var d = new URLSearchParams();
    d.append('estado', ok ? 'CALIFICADO · ve la agenda' : 'NO CALIFICADO · contactar');
    d.append('form-name', formName ? formName.value : 'calificador');
    ['nombre', 'empresa', 'cargo', 'email', 'telefono'].forEach(function (k) { d.append(k, f[k].value.trim()); });
    if (tel) d.append('whatsapp_link', 'https://wa.me/' + tel);
    d.append('tipo_empresa', val('tipo_empresa'));
    if (val('cargo_nivel')) d.append('cargo_nivel', val('cargo_nivel'));
    if (val('area')) d.append('area', val('area'));
    if (val('rol_pyme')) d.append('rol_pyme', val('rol_pyme'));
    d.append('problemas', checked('problemas').join(' · '));
    d.append('empleados', val('empleados'));
    d.append('mensaje', $('motivo').value.trim());
    if (origen && origen.value) d.append('origen', origen.value);
    if (campana && campana.value) d.append('campana', campana.value);
    var trampa = f.querySelector('.hp input'); if (trampa) d.append(trampa.name, trampa.value);
    d.append('sitio', f.getAttribute('data-sitio'));
    b.disabled = true; b.textContent = 'Enviando…';
    try { sessionStorage.setItem('cq_ok', ok ? '1' : '0'); } catch (x) {}
    fetch(window.FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', body: d })
      .then(function () { location.href = f.getAttribute('action') + '?c=' + (ok ? '1' : '0'); })
      .catch(function () { b.disabled = false; update(); if (err) err.hidden = false; });
  }, true);
})();
