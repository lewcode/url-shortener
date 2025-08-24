export const getSlug = (store, req) => {
    const target = store.get(req.params.slug);
    return target;
};
//# sourceMappingURL=store.js.map