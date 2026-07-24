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

    // Inject base href so relative assets load from original server
    html = html.replace('<head>', `<head><base href="https://prospera-nuevo.sistemas.com.bo/modulos/uv/" />`);

    // Ensure mapServRest points to absolute URL of original PHP script
    html = html.replace(
      'var mapServRest = "./view.gestor.php";',
      'var mapServRest = "https://prospera-nuevo.sistemas.com.bo/modulos/uv/view.gestor.php";'
    );

    // Inject CSS & PostMessage Bridge — intercepts XHR response directly
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
        .popover-content, .leaflet-popup-content, .cfm-marker-popover-content {
          padding: 10px 14px !important;
          white-space: nowrap !important;
          min-width: 0 !important;
          font-family: system-ui, -apple-system, sans-serif !important;
        }
        .leaflet-popup-tip-container { opacity: 1 !important; visibility: visible !important; }
        .prospera-estado-badge {
          display: inline-flex !important;
          align-items: center !important;
          gap: 7px !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          letter-spacing: 0.05em !important;
          text-transform: uppercase !important;
          font-family: system-ui, -apple-system, sans-serif !important;
        }
        .prospera-estado-badge .dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }
        .badge-disponible .dot { background: #22c55e; }
        .badge-disponible { color: #15803d; }
        .badge-vendido .dot { background: #ef4444; }
        .badge-vendido { color: #b91c1c; }
        .badge-reservado .dot { background: #3b82f6; }
        .badge-reservado { color: #1d4ed8; }
        .badge-bloqueado .dot { background: #9ca3af; }
        .badge-bloqueado { color: #4b5563; }
      </style>
      <script>
      (function() {
        var lastKey = "";
        function sendLot(lotData) {
          var key = lotData.manzano + "-" + lotData.lote;
          if (key === lastKey) return;
          lastKey = key;
          var msg = { type: 'PROSPERA_LOT_SELECTED', lot: lotData };
          try { window.parent.postMessage(msg, '*'); } catch(e){}
          try { window.top.postMessage(msg, '*'); } catch(e){}
        }

        function extractDataAndSend(text) {
          var cleanStr = text.replace(/<[^>]+>/g, ' ');
          var mMatch = cleanStr.match(/(?:manzano|manz)\\s*:?\\s*([0-9A-Za-z]+)/i);
          if (!mMatch) return false;
          var mVal = mMatch[1];
          if (mVal.toLowerCase() === 'ano') return false;

          var lMatch = cleanStr.match(/(?:lote|lot)\\s*:?\\s*([0-9A-Za-z]+)/i);
          var lVal = lMatch ? lMatch[1] : "-"; // Optional for La Fortuna

          var supM = cleanStr.match(/superficie:?\\s*([0-9.,]+)/i);
          var estM = cleanStr.match(/estado:?\\s*([a-z]+)/i) || cleanStr.match(/(disponible|vendido|reservado|bloqueado|minuta)/i);
          var preM = cleanStr.match(/precio:?\\s*([0-9.,]+)/i) || cleanStr.match(/([0-9.,]+)\\s*(?:\\$us|usd|\\$)/i);

          sendLot({
            manzano: mVal,
            lote: lVal,
            superficie: supM ? (supM[1].trim() + ' m²') : '300 m²',
            estado: estM ? (estM[1].charAt(0).toUpperCase() + estM[1].slice(1).toLowerCase()) : 'Disponible',
            id: '#' + mVal + (lVal !== '-' ? (lVal.length < 2 ? '0' + lVal : lVal) : ''),
            precio: preM ? preM[1].trim() : '7.500'
          });
          return true;
        }

        // Rewrite popup to show only Estado badge
        var _isRewriting = false;
        function rewritePopup(el) {
          try {
            if (el.closest && (el.closest('#leyenda') || el.closest('[id*="legend"]') || el.closest('[class*="leyenda"]'))) return;
            var rawText = el.innerText || el.textContent || '';
            var estadoMatch = rawText.match(/estado\s*:\s*(disponible|vendido|reservado|bloqueado|minuta)/i);
            if (!estadoMatch) return; // if it doesn't contain "Estado: X", do nothing

            extractDataAndSend(rawText);

            var estado = estadoMatch[1].charAt(0).toUpperCase() + estadoMatch[1].slice(1).toLowerCase();
            var cls = 'badge-' + estado.toLowerCase();
            el.innerHTML = '<span class="prospera-estado-badge ' + cls + '"><span class="dot"></span>' + estado + '</span>';
          } catch(e) {}
        }

        (new MutationObserver(function(mutations) {
          if (_isRewriting) return;
          _isRewriting = true;
          try {
            var targets = document.querySelectorAll('.popover-content, .leaflet-popup-content, .cfm-marker-popover, #markerInfoPopover');
            for (var i = 0; i < targets.length; i++) rewritePopup(targets[i]);
          } catch(e) {}
          _isRewriting = false;
        })).observe(document.documentElement, { childList: true, subtree: true });

        // PRIMARY: intercept XHR to parse server JSON response directly
        (function() {
          var OrigXHR = window.XMLHttpRequest;
          var open = OrigXHR.prototype.open;
          var send = OrigXHR.prototype.send;

          OrigXHR.prototype.open = function(method, url) {
            this._xhrUrl = url;
            return open.apply(this, arguments);
          };

          OrigXHR.prototype.send = function(body) {
            var self = this;
            this.addEventListener('readystatechange', function() {
              if (self.readyState !== 4 || self.status !== 200) return;
              try {
                var text = self.responseText;
                if (!text || text.length < 5) return;

                var json = null;
                try { json = JSON.parse(text); } catch(e) {}

                if (json) {
                  var mVal = null, lVal = null, supVal = "300 m²", estVal = "Disponible", priceVal = "7.500", idVal = null;
                  function extract(obj) {
                    if (!obj || typeof obj !== 'object') return;
                    var keys = Object.keys(obj);
                    for (var i = 0; i < keys.length; i++) {
                      var k = keys[i].toLowerCase();
                      var v = obj[keys[i]];
                      if (v === null || v === undefined) continue;
                      var vs = String(v);

                      if (!mVal && (k === 'manzano' || k === 'manz' || k === 'nmanzano')) mVal = vs;
                      if (!lVal && (k === 'lote' || k === 'nlote' || k === 'lot')) lVal = vs;
                      if (k === 'superficie' || k === 'sup' || k === 'area') supVal = vs + (vs.includes('m') ? '' : ' m²');
                      if (k === 'estado' || k === 'status' || k === 'state') estVal = vs.charAt(0).toUpperCase() + vs.slice(1).toLowerCase();
                      if (k === 'precio' || k === 'price' || k === 'costo' || k === 'valor') priceVal = vs;
                      if (k === 'id' || k === 'codigo' || k === 'cod') idVal = vs;

                      if (typeof v === 'object') extract(v);
                      if (Array.isArray(v)) { for (var j = 0; j < v.length; j++) extract(v[j]); }
                    }
                  }
                  extract(json);

                  if (mVal) { // Lote is optional!
                    sendLot({
                      manzano: mVal,
                      lote: lVal || "-",
                      superficie: supVal,
                      estado: estVal,
                      id: idVal || ('#' + mVal + (lVal ? (lVal.length < 2 ? '0' + lVal : lVal) : '')),
                      precio: priceVal
                    });
                    return;
                  }
                }
                
                extractDataAndSend(text);
              } catch(err) {}
            });
            return send.apply(this, arguments);
          };
        })();

        // SECONDARY: scan popup DOM on click as fallback
        function scanPopup() {
          try {
            var selectors = ['.popover', '#markerInfoPopover', '.cfm-marker-popover', '.popover-content', '.leaflet-popup', '.leaflet-popup-content'];
            for (var s = 0; s < selectors.length; s++) {
              var el = document.querySelector(selectors[s]);
              if (!el) continue;
              var fullStr = ((el.innerText || el.textContent || '') + ' ' + (el.innerHTML || '')).replace(/<[^>]+>/g, ' ');
              if (extractDataAndSend(fullStr)) break;
            }
          } catch(e) {}
        }

        document.addEventListener('click', function() {
          [100, 300, 600, 1000].forEach(function(d) { setTimeout(scanPopup, d); });
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
