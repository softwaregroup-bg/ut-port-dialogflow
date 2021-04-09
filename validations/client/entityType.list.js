// @ts-check
/** @type { import("./validation").validation } */
module.exports = joi => ({
    'entityType.list': () => ({
        description: 'List entityType',
        params: joi.any(),
        result: joi.any()
    })
});
