import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // 1. Handle proxied requests to view.gestor.php (server-side data cleaning)
  if (searchParams.has('gestor')) {
    const params = new URLSearchParams(searchParams);
    params.delete('gestor');
    const gestorUrl = `https://prospera-nuevo.sistemas.com.bo/modulos/uv/view.gestor.php?${params.toString()}`;

    try {
      const response = await fetch(gestorUrl);
      let text = await response.text();

      // Server-side sanitization: remove Cliente and Precio fields completely
      text = text.replace(/(?:<b[^>]*>)?Cliente:[\s\S]*?(?:<br\s*\/?>|\n|$)/gi, '');
      text = text.replace(/(?:<b[^>]*>)?Precio:[\s\S]*?(?:<br\s*\/?>|\n|$)/gi, '');

      return new NextResponse(text, {
        headers: {
          'Content-Type': response.headers.get('content-type') || 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow'
        }
      });
    } catch (error) {
      return new NextResponse('Error loading map data', { status: 500 });
    }
  }

  // 2. Handle main map HTML page request
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

    // Override mapServRest to route through our server-side sanitizing proxy
    html = html.replace(
      'var mapServRest = "./view.gestor.php";', 
      'var mapServRest = "/api/map-proxy?gestor=1";'
    );
    html = html.replace(
      'var mapServRest = "https://prospera-nuevo.sistemas.com.bo/modulos/uv/view.gestor.php";',
      'var mapServRest = "/api/map-proxy?gestor=1";'
    );

    // Inject CSS & JS sanitization layers
    const scriptToInject = `
      <style>
        /* Hide left panel and toggle button completely */
        #panelColumn, #panelToggleBtn { display: none !important; }
        #mapColumn { left: 0 !important; width: 100% !important; margin-left: 0 !important; }
        .leaflet-popup-content { font-family: sans-serif !important; }
      </style>
      <script>
        // Triple-layer client sanitizer for Leaflet popups
        
        function cleanHtmlText(input) {
          if (!input || typeof input !== 'string') return input;
          return input
            .replace(/(?:<b[^>]*>)?Cliente:[\s\S]*?(?:<br\s*\/?>|\\n|$)/gi, '')
            .replace(/(?:<b[^>]*>)?Precio:[\s\S]*?(?:<br\s*\/?>|\\n|$)/gi, '');
        }

        // Layer 1: XHR Interceptor
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4 && typeof this.responseText === 'string') {
                    try {
                        let text = cleanHtmlText(this.responseText);
                        Object.defineProperty(this, 'responseText', {
                            get: function() { return text; }
                        });
                    } catch(e) {}
                }
            });
            origOpen.apply(this, arguments);
        };

        // Layer 2: Fetch Interceptor
        const origFetch = window.fetch;
        if (origFetch) {
          window.fetch = async function() {
              const response = await origFetch.apply(this, arguments);
              const clone = response.clone();
              response.text = async function() {
                  let text = await clone.text();
                  return cleanHtmlText(text);
              };
              return response;
          };
        }

        // Layer 3: Continuous 100ms DOM Cleaner + Leaflet popup listener
        document.addEventListener("DOMContentLoaded", () => {
          // Continuous DOM cleaner loop
          setInterval(() => {
            document.querySelectorAll('.leaflet-popup-content').forEach(popup => {
              if (popup.innerHTML && (popup.innerHTML.includes('Cliente:') || popup.innerHTML.includes('Precio:'))) {
                popup.innerHTML = cleanHtmlText(popup.innerHTML);
              }
            });
          }, 100);

          // Leaflet event listener
          const checkMap = setInterval(() => {
            if (window.map && window.map.on) {
              window.map.on('popupopen', (e) => {
                if (e.popup && e.popup._content) {
                  let content = typeof e.popup._content === 'string' ? e.popup._content : e.popup._content.innerHTML;
                  if (content) {
                    let cleaned = cleanHtmlText(content);
                    if (typeof e.popup._content === 'string') {
                      e.popup.setContent(cleaned);
                    } else {
                      e.popup._content.innerHTML = cleaned;
                    }
                  }
                }
              });
              clearInterval(checkMap);
            }
          }, 200);
        });
      </script>
    `;

    html = html.replace('</head>', `${scriptToInject}</head>`);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow'
      }
    });
  } catch (error) {
    return new NextResponse('Error loading map', { status: 500 });
  }
}
