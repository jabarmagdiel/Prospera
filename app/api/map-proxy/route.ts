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

    // Inject CSS & Bootstrap Popover + DOM Sanitizer
    const inject = `
      <style>
        #panelColumn, #panelToggleBtn { display: none !important; }
        #mapColumn { left: 0 !important; width: 100% !important; margin-left: 0 !important; }
        .popover-content { font-family: sans-serif !important; }
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

        // Layer 1: Hook Bootstrap Popover constructor directly
        var checkPopover = setInterval(function() {
          if (window.$ && window.$.fn && window.$.fn.popover && window.$.fn.popover.Constructor) {
            try {
              var origSetContent = window.$.fn.popover.Constructor.prototype.setContent;
              window.$.fn.popover.Constructor.prototype.setContent = function() {
                origSetContent.apply(this, arguments);
                var $tip = this.tip();
                if ($tip && $tip.length) {
                  var html = $tip.html();
                  if (html && (html.toLowerCase().includes('precio') || html.toLowerCase().includes('cliente'))) {
                    $tip.html(cleanHtml(html));
                  }
                }
              };
            } catch(e) {}
            clearInterval(checkPopover);
          }
        }, 30);

        // Layer 2: High-frequency DOM scanner for Bootstrap Popovers & Leaflet popups
        function sanitizeDOM() {
          var selectors = '#markerInfoPopover, .cfm-marker-popover, .popover-content, .popover, .leaflet-popup-content, .leaflet-popup-content-wrapper';
          var elements = document.querySelectorAll(selectors);
          for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (el && el.innerHTML) {
              var lower = el.innerHTML.toLowerCase();
              if (lower.includes('precio') || lower.includes('cliente')) {
                el.innerHTML = cleanHtml(el.innerHTML);
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
