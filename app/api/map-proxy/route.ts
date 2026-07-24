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
        .popover, .leaflet-popup { font-family: system-ui, -apple-system, sans-serif !important; z-index: 10000 !important; }
        .popover-content, .leaflet-popup-content { font-size: 12px !important; line-height: 1.4 !important; }
      </style>
      <script>
      (function() {
        var lastPostedKey = "";

        function parseAndPost(el) {
          if (!el) return;
          var html = el.innerHTML || "";
          var text = el.textContent || el.innerText || "";
          if (!html || html.trim().length < 4) return;

          var cleanText = html.replace(/<[^>]+>/g, ' ');

          var mDigitMatch = cleanText.match(/(?:manzano|manz)\s*:?\s*([0-9]+)/i) || cleanText.match(/\bM-?([0-9]+)\b/i);
          var manzanoMatch = mDigitMatch || cleanText.match(/(?:manzano|manz)\s*:?\s*([a-z0-9\-_]+)/i);
          
          var mVal = manzanoMatch ? manzanoMatch[1] : "";
          if (mVal.toLowerCase() === 'ano') mVal = "";

          var lDigitMatch = cleanText.match(/(?:lote|lot)\s*:?\s*([0-9]+)/i) || cleanText.match(/\bL-?([0-9]+)\b/i);
          var loteMatch = lDigitMatch || cleanText.match(/(?:lote|lot)\s*:?\s*([a-z0-9\-_]+)/i);
          var lVal = loteMatch ? loteMatch[1] : "";

          var supMatch = cleanText.match(/superficie:?\s*([0-9\.,]+(?:\s*m²?)?)/i);
          var estadoMatch = cleanText.match(/estado:?\s*([a-z]+)/i) || cleanText.match(/(disponible|vendido|reservado|bloqueado|minuta)/i);
          var idMatch = cleanText.match(/(#[0-9]+)/i) || cleanText.match(/id:?\s*([0-9]+)/i);
          var precioMatch = cleanText.match(/precio:?\s*([0-9\.,]+)/i) || cleanText.match(/([0-9\.,]+)\s*(?:\$us|usd|\$)/i) || cleanText.match(/(?:\$us|usd|\$)\s*([0-9\.,]+)/i);

          if (!mVal || !lVal) return;

          var key = mVal + "-" + lVal;
          if (key === lastPostedKey) return;
          lastPostedKey = key;

          var rawPriceStr = precioMatch ? precioMatch[1] : "";
          var supStr = supMatch ? (supMatch[1].includes('m') ? supMatch[1] : supMatch[1] + " m²") : "300 m²";

          var lotData = {
            manzano: mVal,
            lote: lVal,
            superficie: supStr,
            estado: estadoMatch ? (estadoMatch[1].charAt(0).toUpperCase() + estadoMatch[1].slice(1).toLowerCase()) : "Disponible",
            id: idMatch ? (idMatch[1].startsWith('#') ? idMatch[1] : '#' + idMatch[1]) : "#" + mVal + lVal,
            precio: rawPriceStr || "7.500"
          };

          window.parent.postMessage({ type: 'PROSPERA_LOT_SELECTED', lot: lotData }, '*');
        }

        function scanDOM() {
          var selectors = '#markerInfoPopover, .cfm-marker-popover, .popover-content, .popover, .leaflet-popup-content, .leaflet-popup-content-wrapper';
          var elements = document.querySelectorAll(selectors);
          for (var i = 0; i < elements.length; i++) {
            parseAndPost(elements[i]);
          }
        }

        try {
          var observer = new MutationObserver(function() {
            scanDOM();
          });
          if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true, characterData: true });
          } else {
            window.addEventListener('DOMContentLoaded', function() {
              observer.observe(document.body, { childList: true, subtree: true, characterData: true });
            });
          }
        } catch(e) {}

        document.addEventListener('click', function(e) {
          setTimeout(scanDOM, 50);
          setTimeout(scanDOM, 200);
          setTimeout(scanDOM, 500);
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
