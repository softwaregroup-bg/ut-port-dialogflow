// @ts-check
/** @type { import("./validation").validation } */
module.exports = joi => ({
    'entityType.batchDelete': () => ({
        description: 'Batch delete entity types',
        params: joi.any(),
        result: joi.any()
    })
});
