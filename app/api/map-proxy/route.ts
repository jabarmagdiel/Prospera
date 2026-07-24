import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('u');

  if (!projectId) {
    return new NextResponse('Missing project ID', { status: 400 });
  }

  const targetUrl = `https://prospera-nuevo.sistemas.com.bo/modulos/uv/?mapa=Y3Jpcw&u=${projectId}`;

  try {
    const response = await fetch(targetUrl);
    let html = await response.text();

    html = html.replace('<head>', `<head><base href="https://prospera-nuevo.sistemas.com.bo/modulos/uv/" />`);
    html = html.replace(
      'var mapServRest = "./view.gestor.php";',
      'var mapServRest = "https://prospera-nuevo.sistemas.com.bo/modulos/uv/view.gestor.php";'
    );

    const inject = `
      <style>
        #panelColumn, #panelToggleBtn { display: none !important; }
        #mapColumn { left: 0 !important; width: 100% !important; margin-left: 0 !important; }
        .popover, .cfm-marker-popover, .leaflet-popup {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          border-radius: 10px !important;
          box-shadow: 0 8px 20px rgba(0,0,0,0.12) !important;
          border: 1px solid #e3dcd0 !important;
          background: #fff !important;
          z-index: 10000 !important;
          width: auto !important;
          min-width: 0 !important;
        }
        .popover-title { display: none !important; }
        .popover-content, .leaflet-popup-content {
          padding: 10px 14px !important;
          white-space: nowrap !important;
          min-width: 0 !important;
          font-family: system-ui, -apple-system, sans-serif !important;
        }
        .leaflet-popup-tip-container { opacity: 1 !important; visibility: visible !important; }
        .prospera-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .prospera-badge .dot {
          width: 9px; height: 9px;
          border-radius: 50%;
          display: inline-block;
        }
        .badge-disponible { color: #15803d; }
        .badge-disponible .dot { background: #22c55e; }
        .badge-vendido { color: #b91c1c; }
        .badge-vendido .dot { background: #ef4444; }
        .badge-reservado { color: #1d4ed8; }
        .badge-reservado .dot { background: #3b82f6; }
        .badge-bloqueado { color: #4b5563; }
        .badge-bloqueado .dot { background: #9ca3af; }
      </style>
      <script>
      (function() {

        // ── POPUP REWRITE ──────────────────────────────────────────────────────────
        var _busy = false;

        function rewritePopup(el) {
          try {
            // Skip if already a badge element or inside legend
            if (!el || el.getAttribute('data-pw') === '1') return;
            if (el.closest && (el.closest('#leyenda') || el.closest('[class*="leyenda"]'))) return;

            var raw = el.innerText || el.textContent || '';
            var m = raw.match(/estado\s*:\s*(disponible|vendido|reservado|bloqueado|minuta)/i);
            if (!m) return;

            var est = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
            el.setAttribute('data-pw', '1');
            el.innerHTML = '<span class="prospera-badge badge-' + est.toLowerCase() + '"><span class="dot"></span>' + est + '</span>';
          } catch(e) {}
        }

        var obs = new MutationObserver(function() {
          if (_busy) return;
          _busy = true;
          try {
            document.querySelectorAll('.popover-content, .leaflet-popup-content').forEach(function(el) {
              rewritePopup(el);
            });
          } catch(e) {}
          _busy = false;
        });
        obs.observe(document.documentElement, { childList: true, subtree: true });

        // ── XHR INTERCEPTOR → postMessage to parent ────────────────────────────────
        var lastKey = '';

        function sendLot(lot) {
          var key = lot.manzano + '-' + lot.lote;
          if (key === lastKey) return;
          lastKey = key;
          var msg = { type: 'PROSPERA_LOT_SELECTED', lot: lot };
          try { window.parent.postMessage(msg, '*'); } catch(e) {}
          try { window.top.postMessage(msg, '*'); } catch(e) {}
        }

        function fromText(txt) {
          var c = txt.replace(/<[^>]+>/g, ' ');
          var mM = c.match(/(?:manzano|manz)\s*:?\s*([0-9]+)/i);
          var lM = c.match(/(?:lote|lot)\s*:?\s*([0-9]+)/i);
          if (!mM || !lM) return;
          var mV = mM[1], lV = lM[1];
          if (mV.toLowerCase() === 'ano') return;
          var sM = c.match(/superficie\s*:?\s*([0-9.,]+)/i);
          var eM = c.match(/estado\s*:\s*([a-z]+)/i) || c.match(/(disponible|vendido|reservado|bloqueado|minuta)/i);
          var pM = c.match(/precio\s*:?\s*([0-9.,]+)/i) || c.match(/([0-9.,]+)\s*(?:\$us|usd|\$)/i);
          sendLot({
            manzano: mV,
            lote: lV,
            superficie: sM ? sM[1] + ' m²' : '300 m²',
            estado: eM ? eM[1].charAt(0).toUpperCase() + eM[1].slice(1).toLowerCase() : 'Disponible',
            id: '#' + mV + (lV.length < 2 ? '0' + lV : lV),
            precio: pM ? pM[1] : '7.500'
          });
        }

        // Intercept XHR to read AJAX responses
        (function() {
          var oOpen = XMLHttpRequest.prototype.open;
          var oSend = XMLHttpRequest.prototype.send;
          XMLHttpRequest.prototype.open = function(m, u) {
            this._u = u;
            return oOpen.apply(this, arguments);
          };
          XMLHttpRequest.prototype.send = function() {
            this.addEventListener('readystatechange', function() {
              if (this.readyState !== 4 || this.status !== 200) return;
              try {
                var txt = this.responseText;
                if (!txt || txt.length < 5) return;
                // Try JSON parse first
                try {
                  var j = JSON.parse(txt);
                  function dig(o) {
                    if (!o || typeof o !== 'object') return;
                    var mV = o.manzano || o.manz || o.nManzano;
                    var lV = o.lote || o.nlote || o.nLote;
                    if (mV && lV) {
                      sendLot({
                        manzano: String(mV),
                        lote: String(lV),
                        superficie: o.superficie ? String(o.superficie) + ' m²' : '300 m²',
                        estado: o.estado ? (String(o.estado).charAt(0).toUpperCase() + String(o.estado).slice(1).toLowerCase()) : 'Disponible',
                        id: '#' + mV + lV,
                        precio: String(o.precio || o.price || o.valor || '7.500')
                      });
                      return;
                    }
                    Object.values(o).forEach(function(v) { if (v && typeof v === 'object') dig(v); });
                  }
                  dig(j);
                  return;
                } catch(e) {}
                // Fallback: parse text
                fromText(txt);
              } catch(e) {}
            });
            return oSend.apply(this, arguments);
          };
        })();

        // Fallback: scan popup DOM on click
        function scanPopup() {
          try {
            var els = document.querySelectorAll('.popover-content, .leaflet-popup-content');
            els.forEach(function(el) { fromText(el.innerText || el.textContent || ''); });
          } catch(e) {}
        }
        document.addEventListener('click', function() {
          [100, 300, 700].forEach(function(d) { setTimeout(scanPopup, d); });
        }, true);

      })();
      </script>`;

    html = html.replace('</head>', `${inject}</head>`);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    return new NextResponse('Error loading map', { status: 500 });
  }
}
