import assert from "node:assert/strict";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";

process.env.NEXT_PUBLIC_GOOGLE_API_KEY = "test-key";
const { batchCategorizeAI } = await import("../lib/helpers/index.ts");

const jobs = (count) => Array.from({ length: count }, (_, index) => ({ title: `Role ${index}`, description: "", job: {} }));
const response = (text) => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }), { status: 200 });
const failure = (status) => new Response(JSON.stringify({ error: { code: status, message: "Service unavailable" } }), { status });

test("classifications stay aligned when concurrent chunks finish out of order", async (t) => {
	t.mock.method(globalThis, "fetch", async (_url, options) => {
		const prompt = JSON.parse(options.body).contents[0].parts[0].text;
		if (prompt.includes("Role 0")) {
			await delay(30);
			return response('["marketing", "finance"]');
		}
		return response('["design", "education"]');
	});
	assert.deepEqual(await batchCategorizeAI(jobs(4), 1, 2, 2), ["marketing", "finance", "design", "education"]);
});

test("invalid entries use fallback without shifting valid classifications", async (t) => {
	t.mock.method(globalThis, "fetch", async () => response('[" DESIGN ", null, 42, "unknown", "Sales"]'));
	assert.deepEqual(await batchCategorizeAI(jobs(5)), ["design", null, null, null, "sales"]);
});

test("malformed JSON and wrong result lengths fall back for the entire chunk", async (t) => {
	for (const payload of ["not json", '["design"]', "null"]) {
		const fetchMock = t.mock.method(globalThis, "fetch", async () => response(payload));
		assert.deepEqual(await batchCategorizeAI(jobs(2), 1), [null, null]);
		fetchMock.mock.restore();
	}
});

test("transient errors retry and recover", async (t) => {
	for (const status of [429, 503]) {
		let calls = 0;
		const fetchMock = t.mock.method(globalThis, "fetch", async () => ++calls === 1 ? failure(status) : response('["healthcare"]'));
		assert.deepEqual(await batchCategorizeAI(jobs(1), 2), ["healthcare"]);
		assert.equal(calls, 2);
		fetchMock.mock.restore();
	}
});

test("exhausted retries stop requests for remaining chunks", async (t) => {
	const fetchMock = t.mock.method(globalThis, "fetch", async () => failure(503));
	assert.deepEqual(await batchCategorizeAI(jobs(4), 2, 1, 1), [null, null, null, null]);
	assert.equal(fetchMock.mock.callCount(), 2);
});

test("permanent errors fall back without retries", async (t) => {
	const fetchMock = t.mock.method(globalThis, "fetch", async () => failure(403));
	assert.deepEqual(await batchCategorizeAI(jobs(2), 3, 1, 1), [null, null]);
	assert.equal(fetchMock.mock.callCount(), 1);
});
