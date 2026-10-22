import test from "node:test";
import assert from "node:assert/strict";
import { serializeJsonLd } from "./json-ld";

test("script bloğunu kapatan diziyi kaçırır", () => {
  const out = serializeJsonLd({ name: 'Ev </script><script>alert(1)</script>' });
  assert.ok(!out.includes("</script>"), `kaçırılmamış: ${out}`);
  assert.ok(!out.includes("<"), "hiçbir < karakteri çıkmamalı");
});

test("büyük/küçük harf ve boşluklu kapanış etiketlerini de kapsar", () => {
  for (const payload of ["</SCRIPT>", "</script >", "</ script>", "<!--"]) {
    const out = serializeJsonLd({ name: payload });
    assert.ok(!out.includes("<"), `kaçırılmamış: ${payload} → ${out}`);
  }
});

test("satır ayırıcı kontrol karakterlerini kaçırır", () => {
  const out = serializeJsonLd({ name: "a\u2028b\u2029c" });
  assert.ok(!out.includes("\u2028"));
  assert.ok(!out.includes("\u2029"));
});

test("kaçırma sonrası JSON aynı veriyi çözer", () => {
  const data = {
    "@context": "https://schema.org",
    name: 'Zeytin </script> & "tırnak" <b>',
    nested: { list: [1, 2, "a<b"] },
  };
  assert.deepEqual(JSON.parse(serializeJsonLd(data)), data);
});

test("zararsız veriyi değiştirmez", () => {
  const data = { "@type": "Residence", name: "Sitre Urla Konakları", area: 180 };
  assert.equal(serializeJsonLd(data), JSON.stringify(data));
});
