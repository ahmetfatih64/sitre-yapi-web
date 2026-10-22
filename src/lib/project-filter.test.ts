import test from "node:test";
import assert from "node:assert/strict";
import type { Project } from "@/content/projects";
import {
  collectTags,
  filterProjects,
  isFilterActive,
  parseFilterState,
  toQueryString,
  toggleTag,
  EMPTY_FILTER,
} from "./project-filter";

function project(
  slug: string,
  status: Project["status"],
  tags: string[]
): Project {
  return { slug, status, tags } as Project;
}

const PROJECTS = [
  project("urla", "active", ["Konut", "Doğa"]),
  project("cesme", "upcoming", ["Konut", "Deniz"]),
  project("bornova", "completed", ["Karma", "Doğa"]),
];

test("etiketler sırası korunarak ve tekrarsız toplanır", () => {
  assert.deepEqual(collectTags(PROJECTS), ["Konut", "Doğa", "Deniz", "Karma"]);
});

test("boş süzgeç tüm projeleri döner", () => {
  assert.equal(filterProjects(PROJECTS, EMPTY_FILTER).length, 3);
});

test("duruma göre süzer", () => {
  const out = filterProjects(PROJECTS, { status: "active", tags: [] });
  assert.deepEqual(out.map((p) => p.slug), ["urla"]);
});

test("etiketler arasında 'veya' uygulanır", () => {
  const out = filterProjects(PROJECTS, { status: "all", tags: ["Deniz", "Karma"] });
  assert.deepEqual(out.map((p) => p.slug), ["cesme", "bornova"]);
});

test("durum ve etiket birlikte 've' olarak uygulanır", () => {
  const out = filterProjects(PROJECTS, { status: "completed", tags: ["Doğa"] });
  assert.deepEqual(out.map((p) => p.slug), ["bornova"]);
  // Aynı etiket ama durum tutmuyorsa elenir.
  assert.deepEqual(
    filterProjects(PROJECTS, { status: "upcoming", tags: ["Doğa"] }),
    []
  );
});

test("etiket seçimi eklenip çıkarılabilir", () => {
  const once = toggleTag(EMPTY_FILTER, "Konut");
  assert.deepEqual(once.tags, ["Konut"]);
  assert.deepEqual(toggleTag(once, "Konut").tags, []);
});

test("toggleTag girdiyi değiştirmez", () => {
  const state = { status: "active" as const, tags: ["Konut"] };
  const snapshot = JSON.stringify(state);
  toggleTag(state, "Deniz");
  assert.equal(JSON.stringify(state), snapshot);
});

test("URL'ye yazılıp geri okunduğunda durum korunur", () => {
  const state = { status: "active" as const, tags: ["Konut", "Doğa"] };
  const parsed = parseFilterState(
    new URLSearchParams(toQueryString(state)),
    collectTags(PROJECTS)
  );
  assert.deepEqual(parsed, state);
});

test("varsayılan değerler URL'ye yazılmaz", () => {
  assert.equal(toQueryString(EMPTY_FILTER), "");
});

test("tanınmayan durum değeri 'all' kabul edilir", () => {
  const parsed = parseFilterState(new URLSearchParams("durum=hepsi-olmayan"));
  assert.equal(parsed.status, "all");
});

test("var olmayan etiket yok sayılır", () => {
  const parsed = parseFilterState(
    new URLSearchParams("etiket=Konut&etiket=Uydurma"),
    collectTags(PROJECTS)
  );
  assert.deepEqual(parsed.tags, ["Konut"]);
});

test("virgülle ayrılmış etiketler de okunur", () => {
  const parsed = parseFilterState(
    new URLSearchParams("etiket=Konut,Deniz"),
    collectTags(PROJECTS)
  );
  assert.deepEqual(parsed.tags, ["Konut", "Deniz"]);
});

test("tekrar eden etiket bir kez sayılır", () => {
  const parsed = parseFilterState(
    new URLSearchParams("etiket=Konut&etiket=Konut"),
    collectTags(PROJECTS)
  );
  assert.deepEqual(parsed.tags, ["Konut"]);
});

test("süzgecin etkin olup olmadığı bilinir", () => {
  assert.equal(isFilterActive(EMPTY_FILTER), false);
  assert.equal(isFilterActive({ status: "active", tags: [] }), true);
  assert.equal(isFilterActive({ status: "all", tags: ["Konut"] }), true);
});
