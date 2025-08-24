import type { FastifyRequest } from "fastify"
import redis from "./redis.js"

export const getSlug = async (req: FastifyRequest<{Params: { slug: string }}>) => {
    const target = await redis.get(req.params.slug)
    return target
}