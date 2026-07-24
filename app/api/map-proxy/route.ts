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
        .popover, .cfm-marker-popover, .popover-content, .leaflet-popup, .leaflet-popup-content-wrapper, .leaflet-popup-tip-container { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }
      </style>
      <script>
      (function() {
        var lastPostedKey = "";

        function parseAndPost(el) {
          if (!el) return;
          var text = el.innerText || el.textContent || "";
          var html = el.innerHTML || "";
          if (!text || text.trim().length < 4) return;

          var manzanoMatch = text.match(/manzano:?\s*([a-z0-9\-_]+)/i) || html.match(/manzano:?\s*<b>?([a-z0-9\-_]+)/i);
          var loteMatch = text.match(/lote:?\s*([a-z0-9\-_]+)/i) || html.match(/lote:?\s*<b>?([a-z0-9\-_]+)/i);
          var supMatch = text.match(/superficie:?\s*([0-9\.,]+\s*m²?)/i) || html.match(/superficie:?\s*<b>?([0-9\.,]+\s*m²?)/i);
          var estadoMatch = text.match(/(disponible|vendido|reservado|bloqueado|minuta)/i);
          var idMatch = text.match(/(#[0-9]+)/i) || text.match(/id:?\s*([0-9]+)/i);
          var precioMatch = text.match(/(usd\s*\$?[0-9\.,]+|\$us\s*[0-9\.,]+|[0-9\.,]+\s*usd)/i) || html.match(/(usd\s*\$?[0-9\.,]+|\$us\s*[0-9\.,]+)/i);

          if (!manzanoMatch && !loteMatch && !supMatch) return;

          var mVal = manzanoMatch ? manzanoMatch[1] : "17";
          var lVal = loteMatch ? loteMatch[1] : "12";
          var key = mVal + "-" + lVal;
          if (key === lastPostedKey) return;
          lastPostedKey = key;

          var rawPrice = precioMatch ? precioMatch[1].replace(/usd|\$us|\$/gi, '').trim() : "7.500";
          var lotData = {
            manzano: mVal,
            lote: lVal,
            superficie: supMatch ? supMatch[1] : "300 m²",
            estado: estadoMatch ? (estadoMatch[1].charAt(0).toUpperCase() + estadoMatch[1].slice(1).toLowerCase()) : "Disponible",
            id: idMatch ? (idMatch[1].startsWith('#') ? idMatch[1] : '#' + idMatch[1]) : "#8496",
            precio: rawPrice.includes('7.50') || rawPrice.includes('7500') ? "7.500" : rawPrice
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

        setInterval(scanDOM, 40);

        document.addEventListener('click', function() {
          setTimeout(scanDOM, 30);
          setTimeout(scanDOM, 100);
          setTimeout(scanDOM, 250);
        });
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
