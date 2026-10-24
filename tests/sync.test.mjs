import assert from "node:assert/strict";
import { test } from "node:test";

process.env.NEXT_PUBLIC_GOOGLE_API_KEY = "test-key";
process.env.MONGODB_URI = "mongodb://unused-in-tests/myjobfeed";

const { default: Category } = await import("../lib/db/models/category.ts");
const { default: Job } = await import("../lib/db/models/job.ts");
const { DEFAULT_CATEGORIES } = await import("../lib/db/seed.ts");
const apis = await import("../lib/config/axios.instance.ts");
const { GET } = await import("../app/api/sync/route.ts");

test("sync seeds missing categories and saves jobs despite AI and source outages", async (t) => {
	globalThis.mongooseCache.conn = {};
	const categories = [{ _id: "existing-finance", slug: "finance" }];
	t.mock.method(Category, "find", () => ({ select: () => ({ lean: async () => [...categories] }) }));
	const seedMock = t.mock.method(Category, "updateOne", async ({ slug }, { $setOnInsert }) => {
		if (!categories.some((category) => category.slug === slug)) categories.push({ ...$setOnInsert, _id: `id-${slug}` });
	});
	const bulkWrite = t.mock.method(Job, "bulkWrite", async (ops) => ({ upsertedCount: ops.length, modifiedCount: 0 }));
	const deleteMany = t.mock.method(Job, "deleteMany", async () => ({ deletedCount: 0 }));

	t.mock.method(apis.arbeitnowApi, "get", async () => ({ data: { data: Array.from({ length: 26 }, (_, index) => ({
		title: index === 0 ? "Software developer" : `Role ${index}`,
		description: "", company_name: "Acme", slug: `role-${index}`, location: "Remote",
		url: `https://example.com/${index}`, created_at: Math.floor(Date.now() / 1000),
	})) } }));
	t.mock.method(apis.museApi, "get", async () => { throw { message: "Request failed with status code 403", response: { data: {} } }; });
	for (const api of [apis.jobicyApi, apis.findWorkApi, apis.remotiveApi, apis.jobDataApi]) {
		t.mock.method(api, "get", async () => ({ data: {} }));
	}
	t.mock.method(apis.joobleApi, "post", async () => ({ data: {} }));
	const fetchMock = t.mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({ error: { code: 503, message: "Service unavailable" } }), { status: 503 }));
	const logs = t.mock.method(console, "error", () => {});

	const result = await GET();
	assert.equal(result.status, 200);
	assert.deepEqual(await result.json(), { success: true });
	assert.equal(categories.length, DEFAULT_CATEGORIES.length);
	assert.equal(categories.find((category) => category.slug === "finance")._id, "existing-finance");
	assert.equal(seedMock.mock.callCount(), DEFAULT_CATEGORIES.length);
	assert.equal(fetchMock.mock.callCount(), 3, "remaining batches must skip AI after an outage");
	assert.equal(bulkWrite.mock.callCount(), 1);
	const operations = bulkWrite.mock.calls[0].arguments[0];
	assert.equal(operations.length, 26);
	assert.ok(operations.every((op) => op.updateOne.update.$set.categoryId === "id-technology"));
	assert.equal(deleteMany.mock.callCount(), 1);
	assert.ok(logs.mock.calls.some((call) => call.arguments[0] === "[Axios Error] [The Muse]"));
});

test("category initialization failure returns a clear error before fetching jobs", async (t) => {
	globalThis.mongooseCache.conn = {};
	t.mock.method(Category, "find", () => ({ select: () => ({ lean: async () => [] }) }));
	t.mock.method(Category, "updateOne", async () => ({}));
	const fetchMock = t.mock.method(apis.arbeitnowApi, "get", async () => { throw new Error("Must not fetch jobs"); });
	t.mock.method(console, "error", () => {});
	const result = await GET();
	assert.equal(result.status, 500);
	assert.match((await result.json()).error, /category initialization failed/);
	assert.equal(fetchMock.mock.callCount(), 0);
});
