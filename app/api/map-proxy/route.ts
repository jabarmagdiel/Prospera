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

    // Inject CSS & Pure Non-blocking DOM Sanitizer (Zero XHR touch = Zero network errors)
    const inject = `
      <style>
        #panelColumn, #panelToggleBtn { display: none !important; }
        #mapColumn { left: 0 !important; width: 100% !important; margin-left: 0 !important; }
        .leaflet-popup-content { font-family: sans-serif !important; }
      </style>
      <script>
      (function() {
        function cleanText(text) {
          if (!text || typeof text !== 'string') return text;
          if (!text.includes('Precio:') && !text.includes('Cliente:')) return text;
          // Strip "Precio: ..." lines completely
          text = text.replace(/(?:<b[^>]*>)?\\s*Precio\\s*:\\s*[\\s\\S]*?(?:<br\\s*\\/?>|\\n|<\\/p>|(?=<div)|$)/gi, '');
          // Strip "Cliente: ..." lines completely
          text = text.replace(/(?:<b[^>]*>)?\\s*Cliente\\s*:\\s*[\\s\\S]*?(?:<br\\s*\\/?>|\\n|<\\/p>|(?=<div)|$)/gi, '');
          // Clean duplicate breaks
          text = text.replace(/(<br\\s*\\/?>\\s*){2,}/gi, '<br>');
          return text;
        }

        function sanitizeDOM() {
          var elements = document.querySelectorAll('.leaflet-popup-content, .leaflet-popup-content-wrapper');
          for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (el && el.innerHTML && (el.innerHTML.includes('Precio:') || el.innerHTML.includes('Cliente:'))) {
              el.innerHTML = cleanText(el.innerHTML);
            }
          }
        }

        // 30ms high-frequency DOM scanner
        setInterval(sanitizeDOM, 30);

        // Observer for DOM mutations
        document.addEventListener('DOMContentLoaded', function() {
          var obs = new MutationObserver(sanitizeDOM);
          obs.observe(document.body, { childList: true, subtree: true, characterData: true });
          sanitizeDOM();
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
