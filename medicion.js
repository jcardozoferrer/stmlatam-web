/* Medición de juliocardozoferrer.com
   ─────────────────────────────────────────────────────────────
   PEGÁ ACÁ TUS CÓDIGOS (dejá las comillas):
     ga4:       el "ID de medición" de Google Analytics, empieza con G-
     metaPixel: el "ID del conjunto de datos / píxel" de Meta, son solo números
     googleAds: opcional, el ID de conversión de Google Ads, empieza con AW-
   Mientras estén vacíos, el sitio funciona igual y no se mide nada.
   ───────────────────────────────────────────────────────────── */
window.JCF_MEDICION = {
  ga4: 'G-R0FV11J4P8',
  metaPixel: '28419957547677879',
  googleAds: ''
};

(function () {
  var C = window.JCF_MEDICION, KEY = 'jcf-consentimiento', loaded = false;
  var store = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  var sstore = function (k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } };

  /* Guardar UTM y gclid/fbclid de la visita para adjuntarlos al formulario */
  var q = new URLSearchParams(location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(function (k) { if (q.get(k)) sstore('jcf_' + k, q.get(k)); });
  if (!sstore('jcf_landing')) sstore('jcf_landing', location.pathname);

  var load = function () {
    if (loaded) return; loaded = true;
    var tagId = C.ga4 || C.googleAds;
    if (tagId) {
      var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + tagId; document.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date());
      if (C.ga4) gtag('config', C.ga4);
      if (C.googleAds) gtag('config', C.googleAds);
    }
    if (C.metaPixel) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', C.metaPixel); fbq('track', 'PageView');
    }
    document.dispatchEvent(new Event('jcf:medicion'));
  };

  /* Eventos de conversión, disponibles para todas las páginas */
  window.jcfTrack = function (name, params) {
    params = params || {};
    if (window.gtag) gtag('event', name, params);
    if (window.fbq) {
      var map = { generate_lead: 'Lead', contact_whatsapp: 'Contact', contact_email: 'Contact', schedule_click: 'Schedule' };
      if (map[name]) fbq('track', map[name], params);
    }
  };

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a'); if (!a) return;
    var h = a.getAttribute('href') || '';
    if (h.indexOf('wa.me') > -1) jcfTrack('contact_whatsapp', { location: a.dataset.track || location.pathname });
    else if (h.indexOf('mailto:') === 0) jcfTrack('contact_email', { location: location.pathname });
    else if (a.hasAttribute('data-book') || h === '#contacto' || h.indexOf('workshop') > -1) jcfTrack('schedule_click', { label: a.textContent.trim().slice(0, 60) });
  });

  /* Aviso de cookies: la medición se carga solo si la persona acepta */
  var banner = function () {
    var css = document.createElement('style');
    css.textContent = '.ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:60;max-width:560px;margin:0 auto;background:#141d38;color:#fff;border-radius:16px;padding:18px 20px;box-shadow:0 18px 40px rgba(0,0,0,.25);font:15px/1.45 "Hanken Grotesk",Arial,sans-serif;display:grid;gap:12px}.ck p{margin:0;color:rgba(255,255,255,.88)}.ck a{color:#a9d4f2}.ck .b{display:flex;gap:8px;flex-wrap:wrap}.ck button{font:600 14px/1 inherit;font-family:inherit;border:0;border-radius:999px;padding:11px 18px;cursor:pointer}.ck .y{background:#fff;color:#141d38}.ck .n{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.4)}';
    document.head.appendChild(css);
    var d = document.createElement('div'); d.className = 'ck'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Aviso de cookies');
    d.innerHTML = '<p>Uso cookies de medición (Google y Meta) para saber qué contenidos sirven y mejorar los anuncios. <a href="privacidad.html">Política de privacidad</a>.</p><div class="b"><button type="button" class="y">Aceptar</button><button type="button" class="n">Solo necesarias</button></div>';
    document.body.appendChild(d);
    d.querySelector('.y').addEventListener('click', function () { store(KEY, 'si'); d.remove(); load(); });
    d.querySelector('.n').addEventListener('click', function () { store(KEY, 'no'); d.remove(); });
  };

  var start = function () {
    if (!(C.ga4 || C.metaPixel || C.googleAds)) return;
    var v = store(KEY);
    if (v === 'si') load(); else if (v !== 'no') banner();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  /* Para reabrir el aviso desde la política de privacidad */
  window.jcfCookies = function () { try { localStorage.removeItem(KEY); } catch (e) {} if (C.ga4 || C.metaPixel || C.googleAds) banner(); };
})();
