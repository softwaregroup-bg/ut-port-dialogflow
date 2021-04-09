// @ts-check
/** @type { import("./validation").validation } */
module.exports = joi => ({
    'entityType.create': () => ({
        description: 'Create entityType',
        params: joi.any(),
        result: joi.any()
    })
});
