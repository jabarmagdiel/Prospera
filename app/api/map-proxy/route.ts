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

    // Inject base href so relative assets load from the original server
    html = html.replace('<head>', `<head><base href="https://prospera-nuevo.sistemas.com.bo/modulos/uv/" />`);

    // Override the API endpoint to use the absolute URL to bypass local proxy issues
    html = html.replace(
      'var mapServRest = "./view.gestor.php";', 
      'var mapServRest = "https://prospera-nuevo.sistemas.com.bo/modulos/uv/view.gestor.php";'
    );

    // Inject script to hide price and CSS to hide panel
    const scriptToInject = `
      <style>
        /* Hide the left panel and toggle button completely */
        #panelColumn, #panelToggleBtn { display: none !important; }
        #mapColumn { left: 0 !important; width: 100% !important; margin-left: 0 !important; }
        .leaflet-popup-content { font-family: sans-serif !important; }
      </style>
      <script>
        // Ultimate Network Interceptor to remove prices before they even reach the map's JS
        
        // 1. Intercept XMLHttpRequest (used by jQuery/older scripts)
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4 && typeof this.responseText === 'string' && this.responseText.includes('Precio:')) {
                    try {
                        let text = this.responseText;
                        // Match "Precio:" followed by anything until a <br>, </div>, </p>, </li>, or \\n
                        text = text.replace(/(<b[^>]*>)?Precio:.*?(\\n|<br|\\<\\/div|\\<\\/p|\\<\\/li|$)/gi, '$2');
                        
                        Object.defineProperty(this, 'responseText', {
                            get: function() { return text; }
                        });
                    } catch(e) {
                        console.error("Error intercepting XHR", e);
                    }
                }
            });
            origOpen.apply(this, arguments);
        };

        // 2. Intercept Fetch API (used by modern scripts)
        const origFetch = window.fetch;
        window.fetch = async function() {
            const response = await origFetch.apply(this, arguments);
            const clone = response.clone();
            
            response.text = async function() {
                let text = await clone.text();
                if (text.includes('Precio:')) {
                    text = text.replace(/(<b[^>]*>)?Precio:.*?(\\n|<br|\\<\\/div|\\<\\/p|\\<\\/li|$)/gi, '$2');
                }
                return text;
            };
            
            response.json = async function() {
                let text = await clone.text();
                if (text.includes('Precio:')) {
                    text = text.replace(/(<b[^>]*>)?Precio:.*?(\\n|<br|\\<\\/div|\\<\\/p|\\<\\/li|$)/gi, '$2');
                }
                return JSON.parse(text);
            };
            
            return response;
        };

        // Fallback MutationObserver just in case the HTML was already in the page source
        document.addEventListener("DOMContentLoaded", () => {
          const observer = new MutationObserver(() => {
            document.querySelectorAll('.leaflet-popup-content').forEach(popup => {
              if (popup.innerHTML.includes('Precio:')) {
                let html = popup.innerHTML;
                html = html.replace(/(<b[^>]*>)?Precio:.*?(<br|\\<\\/div|\\<\\/p|\\<\\/li|$)/gi, '$2');
                if (html !== popup.innerHTML) {
                    popup.innerHTML = html;
                }
              }
            });
          });
          observer.observe(document.body, { childList: true, subtree: true });
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
