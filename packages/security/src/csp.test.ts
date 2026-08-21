import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCsp } from "./csp";

test("includes nonce in script-src", () => {
  const csp = buildCsp({ nonce: "abc123", isDev: false });
  assert.match(csp, /script-src[^;]*'nonce-abc123'/);
});

test("uses strict-dynamic", () => {
  const csp = buildCsp({ nonce: "n", isDev: false });
  assert.match(csp, /'strict-dynamic'/);
});

test("prod omits unsafe-eval; dev allows it", () => {
  const prod = buildCsp({ nonce: "n", isDev: false });
  const dev = buildCsp({ nonce: "n", isDev: true });
  assert.doesNotMatch(prod, /'unsafe-eval'/);
  assert.match(dev, /'unsafe-eval'/);
});

test("blocks framing by default (frame-ancestors 'none')", () => {
  const csp = buildCsp({ nonce: "n", isDev: false });
  assert.match(csp, /frame-ancestors 'none'/);
});

test("object-src is 'none'", () => {
  const csp = buildCsp({ nonce: "n", isDev: false });
  assert.match(csp, /object-src 'none'/);
});

test("extra origins merge into the named directive", () => {
  const csp = buildCsp({
    nonce: "n",
    isDev: false,
    extra: { "connect-src": ["https://api.example.com"] },
  });
  assert.match(csp, /connect-src[^;]*https:\/\/api\.example\.com/);
});

test("dev mode permits localhost connect origins", () => {
  const dev = buildCsp({ nonce: "n", isDev: true });
  assert.match(dev, /connect-src[^;]*ws:\/\/localhost:\*/);
  assert.match(dev, /connect-src[^;]*http:\/\/localhost:\*/);
});

test("upgrade-insecure-requests is emitted as a bare directive", () => {
  const csp = buildCsp({ nonce: "n", isDev: false });
  assert.match(csp, /(^|;\s)upgrade-insecure-requests(;|$)/);
});
