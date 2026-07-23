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

    // Inject CSS & Client-side Sanitizer JS
    const scriptToInject = `
      <style>
        /* Hide left panel and toggle button completely */
        #panelColumn, #panelToggleBtn { display: none !important; }
        #mapColumn { left: 0 !important; width: 100% !important; margin-left: 0 !important; }
        .leaflet-popup-content { font-family: sans-serif !important; }
      </style>
      <script>
        (function() {
          function cleanHtmlText(input) {
            if (!input || typeof input !== 'string') return input;
            return input
              .replace(/(?:<b[^>]*>)?Cliente:[\s\S]*?(?:<br\s*\/?>|\\n|$)/gi, '')
              .replace(/(?:<b[^>]*>)?Precio:[\s\S]*?(?:<br\s*\/?>|\\n|$)/gi, '');
          }

          // Layer 1: XHR Interceptor
          try {
            const origOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function() {
              this.addEventListener('readystatechange', function() {
                if (this.readyState === 4 && typeof this.responseText === 'string') {
                  try {
                    let text = cleanHtmlText(this.responseText);
                    Object.defineProperty(this, 'responseText', {
                      get: function() { return text; },
                      configurable: true
                    });
                  } catch(e) {}
                }
              });
              origOpen.apply(this, arguments);
            };
          } catch(e) {}

          // Layer 2: Fetch Interceptor
          try {
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
          } catch(e) {}

          // Layer 3: Continuous DOM Cleaner & Leaflet Popup Listener
          document.addEventListener("DOMContentLoaded", function() {
            setInterval(function() {
              document.querySelectorAll('.leaflet-popup-content').forEach(function(popup) {
                if (popup.innerHTML && (popup.innerHTML.includes('Cliente:') || popup.innerHTML.includes('Precio:'))) {
                  popup.innerHTML = cleanHtmlText(popup.innerHTML);
                }
              });
            }, 100);

            const checkMap = setInterval(function() {
              if (window.map && window.map.on) {
                window.map.on('popupopen', function(e) {
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
        })();
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
