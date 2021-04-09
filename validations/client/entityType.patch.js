// @ts-check
/** @type { import("./validation").validation } */
module.exports = joi => ({
    'entityType.patch': () => ({
        description: 'Patch entityType',
        params: joi.any(),
        result: joi.any()
    })
});
