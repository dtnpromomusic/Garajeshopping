export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        ok: true,
        app: "GARAJE SHOPPING",
        status: "initialized"
      });
    }

    if (url.pathname.startsWith("/api/")) {
      return Response.json(
        { ok: false, message: "Esta función se habilitará al conectar el almacenamiento de pedidos." },
        { status: 501 }
      );
    }

    return env.ASSETS.fetch(request);
  }
};
