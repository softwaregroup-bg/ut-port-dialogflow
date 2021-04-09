// @ts-check
/** @type { import("./validation").validation } */
module.exports = joi => ({
    'context.list': () => ({
        description: 'List context',
        params: joi.object().keys({
            url: joi.string(),
            method: joi.string().valid('GET'),
            qs: joi.object().keys({
                pageSize: joi.number().optional(),
                pageToken: joi.string().optional()
            }),
            headers: joi.object().keys({
                Authorization: joi.string()
            })
        }),
        result: joi.any()
    })
});
