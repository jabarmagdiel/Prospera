import { NextResponse } from 'next/server';

const GESTOR_URL = 'https://prospera-nuevo.sistemas.com.bo/modulos/uv/view.gestor.php';
const BASE_URL = 'https://prospera-nuevo.sistemas.com.bo/modulos/uv/';

/** Strip sensitive fields from map API responses */
function sanitize(text: string): string {
  // Remove "Cliente: NOMBRE" lines (with or without <b> tag, ending in <br> or end-of-string)
  text = text.replace(/<b>Cliente:<\/b>[^<]*(<br\s*\/?>)?/gi, '');
  text = text.replace(/Cliente:[^\n<]*(<br\s*\/?>|\n)?/gi, '');
  // Remove "Precio: X" lines
  text = text.replace(/<b>Precio:<\/b>[^<]*(<br\s*\/?>)?/gi, '');
  text = text.replace(/Precio:[^\n<]*(<br\s*\/?>|\n)?/gi, '');
  return text;
}

/** GET: serve the main map HTML */
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
    html = html.replace('<head>', `<head><base href="${BASE_URL}" />`);

    // Re-route mapServRest to our POST proxy so data is sanitized server-side
    html = html.replace(
      'var mapServRest = "./view.gestor.php";',
      'var mapServRest = "/api/map-proxy";'
    );
    html = html.replace(
      /var mapServRest = "https?:\/\/[^"]+view\.gestor\.php";/,
      'var mapServRest = "/api/map-proxy";'
    );

    // Inject CSS to hide panel + last-resort DOM cleaner
    const inject = `
      <style>
        #panelColumn, #panelToggleBtn { display: none !important; }
        #mapColumn { left: 0 !important; width: 100% !important; margin-left: 0 !important; }
        .leaflet-popup-content { font-family: sans-serif !important; }
      </style>
      <script>
        (function() {
          // DOM safety net: clean any popup that slips through
          function clean(s) {
            if (!s) return s;
            s = s.replace(/<b>Cliente:<\\/b>[^<]*(<br\\s*\\/?>)?/gi, '');
            s = s.replace(/Cliente:[^\\n<]*(<br\\s*\\/?>|\\n)?/gi, '');
            s = s.replace(/<b>Precio:<\\/b>[^<]*(<br\\s*\\/?>)?/gi, '');
            s = s.replace(/Precio:[^\\n<]*(<br\\s*\\/?>|\\n)?/gi, '');
            return s;
          }
          var obs = new MutationObserver(function(muts) {
            muts.forEach(function(m) {
              m.addedNodes.forEach(function(n) {
                if (n.nodeType === 1) {
                  var p = n.classList && n.classList.contains('leaflet-popup-content')
                    ? n : n.querySelector && n.querySelector('.leaflet-popup-content');
                  if (p && (p.innerHTML.includes('Cliente:') || p.innerHTML.includes('Precio:'))) {
                    p.innerHTML = clean(p.innerHTML);
                  }
                }
              });
            });
          });
          document.addEventListener('DOMContentLoaded', function() {
            obs.observe(document.body, { childList: true, subtree: true });
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

/** POST: proxy to view.gestor.php and sanitize the response */
export async function POST(request: Request) {
  try {
    // Forward the raw body as-is
    const body = await request.text();

    const response = await fetch(GESTOR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body,
    });

    let text = await response.text();

    // Server-side sanitization – runs before the browser ever sees the data
    text = sanitize(text);

    const contentType = response.headers.get('content-type') || 'text/html; charset=utf-8';

    return new NextResponse(text, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    return new NextResponse('Error loading map data', { status: 500 });
  }
}
