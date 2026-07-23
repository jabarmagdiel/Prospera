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

    // Keep mapServRest pointing directly to PHP
    html = html.replace(
      'var mapServRest = "./view.gestor.php";',
      'var mapServRest = "https://prospera-nuevo.sistemas.com.bo/modulos/uv/view.gestor.php";'
    );

    // Inject CSS & Fail-proof multi-layer sanitizer script
    const inject = `
      <style>
        #panelColumn, #panelToggleBtn { display: none !important; }
        #mapColumn { left: 0 !important; width: 100% !important; margin-left: 0 !important; }
        .leaflet-popup-content { font-family: sans-serif !important; }
      </style>
      <script>
      (function() {
        function clean(text) {
          if (!text || typeof text !== 'string') return text;
          // Strip "Precio: ..." lines
          text = text.replace(/(?:<b[^>]*>)?\\s*Precio:\\s*[\\s\\S]*?(?:<br\\s*\\/?>|\\n|<\\/p>|(?=<div)|$)/gi, '');
          // Strip "Cliente: ..." lines
          text = text.replace(/(?:<b[^>]*>)?\\s*Cliente:\\s*[\\s\\S]*?(?:<br\\s*\\/?>|\\n|<\\/p>|(?=<div)|$)/gi, '');
          // Clean duplicate breaks
          text = text.replace(/(<br\\s*\\/?>\\s*){2,}/gi, '<br>');
          return text;
        }

        function sanitizeAllPopups() {
          var popups = document.querySelectorAll('.leaflet-popup-content, .leaflet-popup-content-wrapper');
          popups.forEach(function(el) {
            if (el && el.innerHTML && (el.innerHTML.includes('Cliente:') || el.innerHTML.includes('Precio:'))) {
              el.innerHTML = clean(el.innerHTML);
            }
          });
        }

        // Layer 1: Continuous 50ms cleaner loop
        setInterval(sanitizeAllPopups, 50);

        // Layer 2: MutationObserver watching all DOM changes (characterData & childList)
        var obs = new MutationObserver(function() {
          sanitizeAllPopups();
        });

        document.addEventListener('DOMContentLoaded', function() {
          obs.observe(document.body, { childList: true, subtree: true, characterData: true });
          sanitizeAllPopups();
        });

        // Layer 3: Intercept Leaflet L.Popup.prototype.setContent
        var checkL = setInterval(function() {
          if (window.L && window.L.Popup && window.L.Popup.prototype) {
            var origSetContent = window.L.Popup.prototype.setContent;
            window.L.Popup.prototype.setContent = function(content) {
              if (typeof content === 'string') {
                content = clean(content);
              } else if (content && content.innerHTML) {
                content.innerHTML = clean(content.innerHTML);
              }
              return origSetContent.call(this, content);
            };
            clearInterval(checkL);
          }
        }, 100);
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
