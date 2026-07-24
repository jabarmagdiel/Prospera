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
        .popover, .cfm-marker-popover, .popover-content, .leaflet-popup, .leaflet-popup-content-wrapper, .leaflet-popup-tip-container { position: absolute !important; left: -9999px !important; top: -9999px !important; opacity: 0 !important; pointer-events: none !important; }
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

          var supMatch = cleanText.match(/superficie:?\s*([0-9\.,]+)/i);
          var estadoMatch = cleanText.match(/estado:?\s*([a-z]+)/i) || cleanText.match(/(disponible|vendido|reservado|bloqueado|minuta)/i);
          var idMatch = cleanText.match(/(#[0-9]+)/i) || cleanText.match(/id:?\s*([0-9]+)/i);
          var precioMatch = cleanText.match(/precio:?\s*([0-9\.,]+)/i) || cleanText.match(/([0-9\.,]+)\s*(?:\$us|usd|\$)/i) || cleanText.match(/(?:\$us|usd|\$)\s*([0-9\.,]+)/i);

          if (!mVal || !lVal) return;

          var key = mVal + "-" + lVal;
          if (key === lastPostedKey) return;
          lastPostedKey = key;

          var rawPriceStr = precioMatch ? precioMatch[1] : "7.500";
          var supStr = supMatch ? (supMatch[1] + " m²") : "300 m²";

          var lotData = {
            manzano: mVal,
            lote: lVal,
            superficie: supStr,
            estado: estadoMatch ? (estadoMatch[1].charAt(0).toUpperCase() + estadoMatch[1].slice(1).toLowerCase()) : "Disponible",
            id: idMatch ? (idMatch[1].startsWith('#') ? idMatch[1] : '#' + idMatch[1]) : "#" + Math.floor(1000 + Math.random() * 9000),
            precio: rawPriceStr
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

        document.addEventListener('click', function(e) {
          var target = e.target;
          if (target) {
            var targetText = (target.getAttribute && target.getAttribute('title')) || target.innerText || target.textContent || "";
            if (targetText && (targetText.includes('Manz') || targetText.includes('Lote') || targetText.includes('Precio'))) {
              parseAndPost({ innerHTML: targetText, textContent: targetText });
            }
          }
          setTimeout(scanDOM, 30);
          setTimeout(scanDOM, 100);
          setTimeout(scanDOM, 300);
          setTimeout(scanDOM, 600);
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
