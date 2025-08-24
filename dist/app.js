import Fastify from 'fastify';
import { collectDefaultMetrics, Counter, Histogram, Registry } from 'prom-client';
import { shortenBody } from './types.js';
import { getSlug } from './store.js';
import { randomSlugGenerator } from './utils.js';
export const buildApp = () => {
    const app = Fastify({
        logger: {
            level: process.env.LOG_LEVEL || "info",
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true
                }
            }
        }
    });
    const register = new Registry();
    collectDefaultMetrics({ register });
    const httpDuration = new Histogram({
        name: "http_request_duration_ms",
        help: "http request duration ms",
        labelNames: ["route", "method", "status"],
        buckets: [5, 10, 25, 50, 100, 250, 500, 1000]
    });
    const httpRequests = new Counter({
        name: "http_request_total",
        help: "Total HTTP requests",
        labelNames: ["route", "method", "status"]
    });
    register.registerMetric(httpDuration);
    register.registerMetric(httpRequests);
    app.get("/metrics", async (_req, reply) => {
        reply.header("Content-Type", register.contentType);
        return register.metrics();
    });
    app.get("/health", async () => {
        return {
            ok: true,
        };
    });
    const store = new Map();
    app.post("/shorten", (req, reply) => {
        const body = shortenBody.parse(req.body);
        const slug = randomSlugGenerator();
        store.set(slug, body.url);
        return {
            slug,
            shortUrl: `${process.env.BASE_URL ?? "http://localhost:3000"}/${slug}`
        };
    });
    app.get("/:slug", (req, reply) => {
        const target = getSlug(store, req);
        if (!target) {
            return reply.code(404).send({
                error: "slug not found"
            });
        }
        return reply.redirect(target, 301);
    });
    app.addHook("onSend", async (req, reply, payload) => {
        const labels = {
            // check this routerPath not available
            route: req.originalUrl ?? req.url,
            method: req.method,
            status: String(reply.statusCode)
        };
        httpRequests.inc(labels);
        httpDuration.observe(labels, reply.elapsedTime);
        return payload;
    });
    return app;
};
//# sourceMappingURL=app.js.map