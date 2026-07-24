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
        }
        .popover-content, .leaflet-popup-content {
          font-family: system-ui, -apple-system, sans-serif !important;
          font-size: 11px !important;
          padding: 8px 12px !important;
          line-height: 1.5 !important;
        }
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

                // Try to parse as JSON first
                var json = null;
                try { json = JSON.parse(text); } catch(e) {}

                if (json) {
                  // Extract lot data from JSON response
                  var mVal = null, lVal = null, supVal = "300 m²", estVal = "Disponible", priceVal = "7.500", idVal = null;

                  // Flatten all keys/values from json object
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

                  if (mVal && lVal) {
                    sendLot({
                      manzano: mVal,
                      lote: lVal,
                      superficie: supVal,
                      estado: estVal,
                      id: idVal || ('#' + mVal + (lVal.length < 2 ? '0' + lVal : lVal)),
                      precio: priceVal
                    });
                    return;
                  }
                }

                // Fallback: parse plain text response
                var cleanStr = text.replace(/<[^>]+>/g, ' ');
                var mMatch = cleanStr.match(/(?:manzano|manz)\\s*:?\\s*([0-9]+)/i);
                var lMatch = cleanStr.match(/(?:lote|lot)\\s*:?\\s*([0-9]+)/i);
                if (mMatch && lMatch) {
                  var supM = cleanStr.match(/superficie:?\\s*([0-9.,]+)/i);
                  var estM = cleanStr.match(/estado:?\\s*([a-z]+)/i) || cleanStr.match(/(disponible|vendido|reservado|bloqueado)/i);
                  var preM = cleanStr.match(/precio:?\\s*([0-9.,]+)/i) || cleanStr.match(/([0-9.,]+)\\s*(?:\\$us|usd|\\$)/i);
                  sendLot({
                    manzano: mMatch[1],
                    lote: lMatch[1],
                    superficie: supM ? (supM[1] + ' m²') : '300 m²',
                    estado: estM ? (estM[1].charAt(0).toUpperCase() + estM[1].slice(1).toLowerCase()) : 'Disponible',
                    id: '#' + mMatch[1] + lMatch[1],
                    precio: preM ? preM[1] : '7.500'
                  });
                }
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
              if (!fullStr || fullStr.length < 15) continue;

              var mMatch = fullStr.match(/(?:manzano|manz)\\s*:?\\s*([0-9]+)/i);
              var lMatch = fullStr.match(/(?:lote|lot)\\s*:?\\s*([0-9]+)/i);
              if (!mMatch || !lMatch) continue;

              var mVal = mMatch[1], lVal = lMatch[1];
              if (mVal.toLowerCase() === 'ano') continue;

              var supM = fullStr.match(/superficie:?\\s*([0-9.,]+)/i);
              var estM = fullStr.match(/estado:?\\s*([a-z]+)/i) || fullStr.match(/(disponible|vendido|reservado|bloqueado)/i);
              var preM = fullStr.match(/precio:?\\s*([0-9.,]+)/i) || fullStr.match(/([0-9.,]+)\\s*(?:\\$us|usd|\\$)/i);

              sendLot({
                manzano: mVal,
                lote: lVal,
                superficie: supM ? (supM[1].trim() + ' m²') : '300 m²',
                estado: estM ? (estM[1].charAt(0).toUpperCase() + estM[1].slice(1).toLowerCase()) : 'Disponible',
                id: '#' + mVal + (lVal.length < 2 ? '0' + lVal : lVal),
                precio: preM ? preM[1].trim() : '7.500'
              });
              break;
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
