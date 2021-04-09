// @ts-check
/** @type { import("./validation").validation } */
module.exports = joi => ({
    'entityType.get': () => ({
        description: 'Get entityType',
        params: joi.any(),
        result: joi.any()
    })
});
