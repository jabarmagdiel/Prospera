import { NextResponse } from 'next/server';

/** Strip sensitive fields from map popup HTML */
function sanitize(text: string): string {
  text = text.replace(/<b>Cliente:<\/b>[^<]*(<br\s*\/?>)?/gi, '');
  text = text.replace(/Cliente:[^\n<]*(<br\s*\/?>|\n)?/gi, '');
  text = text.replace(/<b>Precio:<\/b>[^<]*(<br\s*\/?>)?/gi, '');
  text = text.replace(/Precio:[^\n<]*(<br\s*\/?>|\n)?/gi, '');
  return text;
}

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

    // Keep mapServRest pointing directly to PHP (so the map loads without errors)
    // but replace relative path with absolute URL
    html = html.replace(
      'var mapServRest = "./view.gestor.php";',
      'var mapServRest = "https://prospera-nuevo.sistemas.com.bo/modulos/uv/view.gestor.php";'
    );

    // Inject CSS & aggressive hide-then-clean interceptor
    const inject = `
      <style>
        #panelColumn, #panelToggleBtn { display: none !important; }
        #mapColumn { left: 0 !important; width: 100% !important; margin-left: 0 !important; }
        /* Popups start invisible; JS will clean then reveal them */
        .leaflet-popup-content-wrapper { opacity: 0; transition: opacity 0.15s ease; }
        .leaflet-popup-content-wrapper.prospera-ready { opacity: 1; }
      </style>
      <script>
      (function() {
        function clean(html) {
          if (!html) return html;
          html = html.replace(/<b>Cliente:<\\/b>[^<]*(<br\\s*\\/?>)?/gi, '');
          html = html.replace(/Cliente:[^\\n<]*(<br\\s*\\/?>|\\n)?/gi, '');
          html = html.replace(/<b>Precio:<\\/b>[^<]*(<br\\s*\\/?>)?/gi, '');
          html = html.replace(/Precio:[^\\n<]*(<br\\s*\\/?>|\\n)?/gi, '');
          return html;
        }

        function processPopup(wrapper) {
          if (!wrapper) return;
          var content = wrapper.querySelector('.leaflet-popup-content');
          if (content) {
            content.innerHTML = clean(content.innerHTML);
          }
          wrapper.classList.add('prospera-ready');
        }

        // MutationObserver: fires as soon as popup is added to DOM (before paint)
        var obs = new MutationObserver(function(mutations) {
          mutations.forEach(function(m) {
            m.addedNodes.forEach(function(n) {
              if (n.nodeType !== 1) return;
              // Check if added node is or contains a popup wrapper
              var wrapper = null;
              if (n.classList && n.classList.contains('leaflet-popup-content-wrapper')) {
                wrapper = n;
              } else if (n.querySelector) {
                wrapper = n.querySelector('.leaflet-popup-content-wrapper');
              }
              if (wrapper) {
                processPopup(wrapper);
              }
            });
          });
        });

        document.addEventListener('DOMContentLoaded', function() {
          obs.observe(document.body, { childList: true, subtree: true });
        });

        // Backup: also hook into Leaflet's popupopen event once map is ready
        var checkMap = setInterval(function() {
          if (window.map && typeof window.map.on === 'function') {
            window.map.on('popupopen', function(e) {
              if (e.popup && e.popup._wrapper) {
                processPopup(e.popup._wrapper);
              } else {
                // Find the open popup in DOM
                setTimeout(function() {
                  document.querySelectorAll('.leaflet-popup-content-wrapper').forEach(processPopup);
                }, 0);
              }
            });
            clearInterval(checkMap);
          }
        }, 200);
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
