const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../src/app");

const request = (path) => new Promise((resolve, reject) => {
  const server = app.listen(0, () => {
    const port = server.address().port;
    http.get({ host: "127.0.0.1", port, path }, (res) => {
      res.resume();
      res.on("end", () => { server.close(); resolve(res.statusCode); });
    }).on("error", (error) => { server.close(); reject(error); });
  });
});

test("root endpoint is available", async () => {
  assert.equal(await request("/"), 200);
});

test("case-study routes require authentication", async () => {
  assert.equal(await request("/api/inventory"), 401);
  assert.equal(await request("/api/quotations"), 401);
  assert.equal(await request("/api/sales-orders"), 401);
});
