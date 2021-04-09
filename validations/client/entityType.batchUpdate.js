// @ts-check
/** @type { import("./validation").validation } */
module.exports = joi => ({
    'entityType.batchUpdate': () => ({
        description: 'Batch update entity types',
        params: joi.any(),
        result: joi.any()
    })
});
