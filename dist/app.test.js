import { describe, test, expect, vi, beforeAll } from "vitest";
import { buildApp } from "./app.js";
import * as store from "./store.js";
import * as utils from "./utils.js";
const app = buildApp();
describe("Test server endpoints", () => {
    beforeAll(() => {
        vi.clearAllMocks();
        vi.spyOn(store, "getSlug").mockResolvedValue("https://example.com");
        vi.spyOn(utils, "randomSlugGenerator").mockReturnValue("dhhjqhi1234");
    });
    test("/get", async () => {
        // Mock the getSlug function to return a URL (not a slug)
        const response = await app.inject({
            method: "GET",
            url: "/someslug",
        });
        expect(response.statusCode).toBe(301);
        // For a redirect, there's no JSON response body - check the Location header instead
        expect(response.headers.location).toBe("https://example.com");
    });
    test("/shorten", async () => {
        const response = await app.inject({
            method: "POST",
            url: "/shorten",
            body: {
                url: "https://example.com",
            },
        });
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            slug: "dhhjqhi1234",
            shortUrl: "http://localhost/dhhjqhi1234",
        });
    });
    test("/metrics", async () => {
        const response = await app.inject({ method: "GET", url: "/metrics" });
        expect(response.statusCode).toBe(200);
    });
});
//# sourceMappingURL=app.test.js.map