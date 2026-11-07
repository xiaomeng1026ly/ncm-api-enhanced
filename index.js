const http = require("http");
const { URL } = require("url");

const PORT = parseInt(process.env.FC_SERVER_PORT || "9000", 10);
const HOST = process.env.HOST || "0.0.0.0";

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${HOST}:${PORT}`);

  // 健康检查端点，必须与 s.yaml 中的 healthCheckConfig.httpGetUrl 一致
  if (url.pathname === "/healthz") {
    return sendJson(res, 200, { status: "ok", timestamp: Date.now() });
  }

  if (url.pathname === "/") {
    return sendJson(res, 200, { message: "ncm-api-enhanced is running" });
  }

  // ---------- 在此处集成你的实际业务路由 ----------
  // if (url.pathname === "/api/v1/xxx") { ... }

  return sendJson(res, 404, { error: "Not Found", path: url.pathname });
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
