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

    // Inject CSS & Safe jQuery/Leaflet/DOM Multi-Layer Sanitizer
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
          if (!text.includes('Precio:') && !text.includes('Cliente:')) return text;
          // Strip "Precio: ..." lines completely
          text = text.replace(/(?:<b[^>]*>)?\\s*Precio\\s*:\\s*[\\s\\S]*?(?:<br\\s*\\/?>|\\n|<\\/p>|(?=<div)|$)/gi, '');
          // Strip "Cliente: ..." lines completely
          text = text.replace(/(?:<b[^>]*>)?\\s*Cliente\\s*:\\s*[\\s\\S]*?(?:<br\\s*\\/?>|\\n|<\\/p>|(?=<div)|$)/gi, '');
          // Clean duplicate breaks
          text = text.replace(/(<br\\s*\\/?>\\s*){2,}/gi, '<br>');
          return text;
        }

        // Layer 1: jQuery dataFilter AJAX Sanitizer (Official jQuery Hook)
        var checkJQuery = setInterval(function() {
          if (window.$ && window.$.ajaxSetup) {
            try {
              window.$.ajaxSetup({
                dataFilter: function(data) {
                  return clean(data);
                }
              });
            } catch(e) {}
            clearInterval(checkJQuery);
          }
        }, 30);

        // Layer 2: Safe XHR responseText Override (with try-catch to prevent DOMExceptions)
        try {
          var xhrProto = XMLHttpRequest.prototype;
          var origResponseText = Object.getOwnPropertyDescriptor(xhrProto, 'responseText');
          if (origResponseText && origResponseText.get) {
            Object.defineProperty(xhrProto, 'responseText', {
              get: function() {
                try {
                  var val = origResponseText.get.call(this);
                  return clean(val);
                } catch(err) {
                  return origResponseText.get ? origResponseText.get.call(this) : "";
                }
              },
              configurable: true,
              enumerable: true
            });
          }
        } catch(e) {}

        // Layer 3: Leaflet L.Popup.prototype.setContent Interceptor
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
        }, 50);

        // Layer 4: Continuous DOM Sanitizer + MutationObserver
        function sanitizeDOM() {
          var popups = document.querySelectorAll('.leaflet-popup-content, .leaflet-popup-content-wrapper');
          popups.forEach(function(el) {
            if (el && el.innerHTML && (el.innerHTML.includes('Cliente:') || el.innerHTML.includes('Precio:'))) {
              el.innerHTML = clean(el.innerHTML);
            }
          });
        }
        setInterval(sanitizeDOM, 50);
        document.addEventListener('DOMContentLoaded', function() {
          var obs = new MutationObserver(sanitizeDOM);
          obs.observe(document.body, { childList: true, subtree: true, characterData: true });
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
