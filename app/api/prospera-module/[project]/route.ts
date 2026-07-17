const UPSTREAM_ROOT = process.env.PROSPERA_UPSTREAM_ROOT ?? "";
const MAP_TOKEN = process.env.PROSPERA_MAP_TOKEN ?? "";
const ALLOWED_PROJECTS = new Set(["1", "2", "3", "5"]);
const ALLOWED_ACTIONS = new Set(["", "getMapView", "loteInfo", "getMarkerInfo", "getSearchType", "searchMarkers"]);

type RouteContext = { params: Promise<{ project: string }> };

function corsHeaders(contentType: string | null) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
    "Content-Type": contentType ?? "application/json; charset=UTF-8",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
  };
}

async function getProject(context: RouteContext) {
  const { project } = await context.params;
  return ALLOWED_PROJECTS.has(project) ? project : null;
}

export async function POST(request: Request, context: RouteContext) {
  const project = await getProject(context);
  if (!project) return Response.json({ code: 4, data: null }, { status: 404, headers: corsHeaders(null) });

  if (!UPSTREAM_ROOT || !MAP_TOKEN) {
    return Response.json(
      { code: 4, data: null, message: "El módulo de planos no está configurado en el entorno." },
      { status: 503, headers: corsHeaders(null) },
    );
  }

  const requestUrl = new URL(request.url);
  const action = requestUrl.searchParams.get("a") ?? "";
  if (!ALLOWED_ACTIONS.has(action)) {
    return Response.json({ code: 3, data: null }, { status: 400, headers: corsHeaders(null) });
  }

  const body = await request.text();
  if (body.length > 20000) {
    return Response.json({ code: 3, data: null }, { status: 413, headers: corsHeaders(null) });
  }

  const upstreamUrl = new URL(`${UPSTREAM_ROOT}/view.gestor.php`);
  upstreamUrl.searchParams.set("c", "");
  upstreamUrl.searchParams.set("a", action);
  upstreamUrl.searchParams.set("mapa", MAP_TOKEN);
  upstreamUrl.searchParams.set("u", project);
  const uv = requestUrl.searchParams.get("uv");
  if (uv && /^[-A-Za-z0-9]+$/.test(uv)) upstreamUrl.searchParams.set("uv", uv);

  try {
    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body,
      cache: "no-store",
    });
    return new Response(upstream.body, { status: upstream.status, headers: corsHeaders(upstream.headers.get("content-type")) });
  } catch {
    return Response.json({ code: 4, data: null }, { status: 502, headers: corsHeaders(null) });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
