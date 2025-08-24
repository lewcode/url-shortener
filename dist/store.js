import redis from "./redis.js";
export const getSlug = async (req) => {
    const target = await redis.get(req.params.slug);
    return target;
};
//# sourceMappingURL=store.js.map