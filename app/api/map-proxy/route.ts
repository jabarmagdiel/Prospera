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

    // Inject CSS & Bulletproof Line-by-Line DOM Filter
    const inject = `
      <style>
        #panelColumn, #panelToggleBtn { display: none !important; }
        #mapColumn { left: 0 !important; width: 100% !important; margin-left: 0 !important; }
        .leaflet-popup-content { font-family: sans-serif !important; }
      </style>
      <script>
      (function() {
        function cleanHtml(html) {
          if (!html || typeof html !== 'string') return html;
          var lower = html.toLowerCase();
          if (!lower.includes('precio') && !lower.includes('cliente')) return html;

          var parts = html.split(/(<br\\s*\\/?>|\\n)/gi);
          var cleanParts = [];

          for (var i = 0; i < parts.length; i++) {
            var p = parts[i];
            var pLower = p.toLowerCase();
            if (pLower.includes('precio') || pLower.includes('cliente')) {
              continue;
            }
            cleanParts.push(p);
          }

          var result = cleanParts.join('');
          return result.replace(/(<br\\s*\\/?>\\s*){2,}/gi, '<br>');
        }

        function sanitizeDOM() {
          var elements = document.querySelectorAll('.leaflet-popup-content, .leaflet-popup-content-wrapper, .leaflet-popup');
          for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (el && el.innerHTML) {
              var lower = el.innerHTML.toLowerCase();
              if (lower.includes('precio') || lower.includes('cliente')) {
                var target = el.querySelector ? (el.querySelector('.leaflet-popup-content') || el) : el;
                target.innerHTML = cleanHtml(target.innerHTML);
              }
            }
          }
        }

        // 20ms high-frequency DOM scanner
        setInterval(sanitizeDOM, 20);

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
