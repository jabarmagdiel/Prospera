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

        var lastKey = '';
        function sendLot(lot) {
          var key = lot.manzano + '-' + lot.lote;
          if (key === lastKey) return;
          lastKey = key;
          var msg = { type: 'PROSPERA_LOT_SELECTED', lot: lot };
          try { window.parent.postMessage(msg, '*'); } catch(e) {}
          try { window.top.postMessage(msg, '*'); } catch(e) {}
        }

        // ── POPUP REWRITE ──────────────────────────────────────────────────────────
        var _busy = false;

        function rewritePopup(el) {
          try {
            if (el.closest && (el.closest('#leyenda') || el.closest('[class*="leyenda"]'))) return;

            var raw = el.innerText || el.textContent || '';
            // If the popup doesn't explicitly have "Estado: X", we do nothing.
            // This also prevents infinite loops because after rewrite, the text is just "Disponible" (no "Estado:")
            var m = raw.match(/estado\s*:\s*(disponible|vendido|reservado|bloqueado|minuta)/i);
            if (!m) return;

            // Optional fallback: if popup has both Manzano AND Lote, we can sendLot here
            var c = raw.replace(/<[^>]+>/g, ' ');
            var mM = c.match(/(?:manzano|manz)\s*:?\s*([0-9]+)/i);
            var lM = c.match(/(?:lote|lot)\s*:?\s*([0-9]+)/i);
            if (mM && lM) {
              var sM = c.match(/superficie\s*:?\s*([0-9.,]+)/i);
              var pM = c.match(/precio\s*:?\s*([0-9.,]+)/i) || c.match(/([0-9.,]+)\s*(?:\$us|usd|\$)/i);
              sendLot({
                manzano: mM[1],
                lote: lM[1],
                superficie: sM ? sM[1] + ' m²' : '300 m²',
                estado: m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase(),
                id: '#' + mM[1] + (lM[1].length < 2 ? '0' + lM[1] : lM[1]),
                precio: pM ? pM[1] : '7.500'
              });
            }

            // Replace the entire content with just the badge
            var est = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
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
        // This is crucial for maps where Lote is NOT in the popup HTML, but is in the JSON response
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
                
                // Parse JSON
                var j = null;
                try { j = JSON.parse(txt); } catch(e) {}
                
                if (j) {
                  var mVal = null, lVal = null, supVal = "300 m²", estVal = "Disponible", priceVal = "7.500", idVal = null;
                  
                  function dig(o) {
                    if (!o || typeof o !== 'object') return;
                    var keys = Object.keys(o);
                    for (var i = 0; i < keys.length; i++) {
                      var k = keys[i].toLowerCase();
                      var v = o[keys[i]];
                      if (v === null || v === undefined) continue;
                      var vs = String(v);

                      if (!mVal && (k === 'manzano' || k === 'manz' || k === 'nmanzano')) mVal = vs;
                      if (!lVal && (k === 'lote' || k === 'nlote' || k === 'lot')) lVal = vs;
                      if (k === 'superficie' || k === 'sup' || k === 'area') supVal = vs + (vs.indexOf('m') !== -1 ? '' : ' m²');
                      if (k === 'estado' || k === 'status' || k === 'state') estVal = vs.charAt(0).toUpperCase() + vs.slice(1).toLowerCase();
                      if (k === 'precio' || k === 'price' || k === 'costo' || k === 'valor') priceVal = vs;
                      if (k === 'id' || k === 'codigo' || k === 'cod') idVal = vs;

                      if (typeof v === 'object') dig(v);
                      if (Array.isArray(v)) { for (var x = 0; x < v.length; x++) dig(v[x]); }
                    }
                  }
                  
                  dig(j);
                  
                  if (mVal && lVal) {
                    sendLot({
                      manzano: mVal,
                      lote: lVal,
                      superficie: supVal,
                      estado: estVal,
                      id: idVal || ('#' + mVal + (lVal.length < 2 ? '0' + lVal : lVal)),
                      precio: priceVal
                    });
                  }
                }
              } catch(e) {}
            });
            return oSend.apply(this, arguments);
          };
        })();

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
