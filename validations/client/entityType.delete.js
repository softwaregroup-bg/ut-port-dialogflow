// @ts-check
/** @type { import("./validation").validation } */
module.exports = joi => ({
    'entityType.delete': () => ({
        description: 'Delete entityType',
        params: joi.any(),
        result: joi.any()
    })
});
