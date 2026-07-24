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

    // Inject CSS & Bootstrap Popover + DOM Sanitizer & PostMessage Bridge
    const inject = `
      <style>
        #panelColumn, #panelToggleBtn { display: none !important; }
        #mapColumn { left: 0 !important; width: 100% !important; margin-left: 0 !important; }
        .popover, .cfm-marker-popover, .leaflet-popup {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
          border: 1px solid #e3dcd0 !important;
          background: #ffffff !important;
          z-index: 10000 !important;
        }
        .popover-content, .leaflet-popup-content {
          font-family: system-ui, -apple-system, sans-serif !important;
          font-size: 11px !important;
          padding: 8px 12px !important;
          line-height: 1.4 !important;
        }
      </style>
      <script>
      (function() {
        var lastPostedData = "";

        function scanAndExtract() {
          try {
            var popups = document.querySelectorAll('.popover, #markerInfoPopover, .cfm-marker-popover, .popover-content, .leaflet-popup, .leaflet-popup-content, .leaflet-popup-content-wrapper');
            for (var i = 0; i < popups.length; i++) {
              try {
                var el = popups[i];
                if (!el) continue;
                var text = (el.innerText || el.textContent || "").trim();
                var html = (el.innerHTML || "").trim();
                if (!text && !html) continue;

                var fullStr = (html + " " + text).replace(/<[^>]+>/g, ' ');

                var mMatch = fullStr.match(/(?:manzano|manz)\s*:?\s*([0-9]+)/i) || fullStr.match(/\bM-?([0-9]+)\b/i);
                var lMatch = fullStr.match(/(?:lote|lot)\s*:?\s*([0-9]+)/i) || fullStr.match(/\bL-?([0-9]+)\b/i);

                if (mMatch && lMatch) {
                  var mVal = mMatch[1];
                  var lVal = lMatch[1];
                  if (mVal.toLowerCase() === 'ano') continue;

                  var supMatch = fullStr.match(/superficie:?\s*([0-9\.,]+)/i);
                  var estadoMatch = fullStr.match(/estado:?\s*([a-z]+)/i) || fullStr.match(/(disponible|vendido|reservado|bloqueado|minuta)/i);
                  var precioMatch = fullStr.match(/precio:?\s*([0-9\.,]+)/i) || fullStr.match(/([0-9\.,]+)\s*(?:\$us|usd|\$)/i) || fullStr.match(/(?:\$us|usd|\$)\s*([0-9\.,]+)/i);
                  var idMatch = fullStr.match(/(#[0-9]+)/i) || fullStr.match(/id:?\s*([0-9]+)/i);

                  var supStr = supMatch ? (supMatch[1].trim() + " m²") : "300 m²";
                  var estadoStr = estadoMatch ? (estadoMatch[1].charAt(0).toUpperCase() + estadoMatch[1].slice(1).toLowerCase()) : "Disponible";
                  var priceStr = precioMatch ? precioMatch[1].trim() : "7.500";
                  var idStr = idMatch ? idMatch[1] : ("#" + mVal + (lVal.length < 2 ? "0" + lVal : lVal));

                  var lotData = {
                    manzano: mVal,
                    lote: lVal,
                    superficie: supStr,
                    estado: estadoStr,
                    id: idStr,
                    precio: priceStr
                  };

                  var currentDataStr = JSON.stringify(lotData);
                  if (currentDataStr !== lastPostedData) {
                    lastPostedData = currentDataStr;
                    try { window.parent.postMessage({ type: 'PROSPERA_LOT_SELECTED', lot: lotData }, '*'); } catch(e){}
                    try { window.top.postMessage({ type: 'PROSPERA_LOT_SELECTED', lot: lotData }, '*'); } catch(e){}
                  }
                  break;
                }
              } catch(err) {}
            }
          } catch(err) {}
        }

        setInterval(scanAndExtract, 100);

        document.addEventListener('click', function(e) {
          for (var delay of [10, 50, 150, 350, 700]) {
            setTimeout(scanAndExtract, delay);
          }
        }, true);

        try {
          var origOpen = XMLHttpRequest.prototype.open;
          var origSend = XMLHttpRequest.prototype.send;
          XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            return origOpen.apply(this, arguments);
          };
          XMLHttpRequest.prototype.send = function() {
            this.addEventListener('load', function() {
              for (var delay of [10, 50, 200, 500]) {
                setTimeout(scanAndExtract, delay);
              }
            });
            return origSend.apply(this, arguments);
          };
        } catch(e) {}
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
