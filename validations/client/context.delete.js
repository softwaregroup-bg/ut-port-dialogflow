// @ts-check
/** @type { import("./validation").validation } */
module.exports = joi => ({
    'context.delete': () => ({
        description: 'Delete context',
        params: joi.object().keys({
            url: joi.string(),
            method: joi.string().valid('DELETE'),
            headers: joi.object().keys({
                Authorization: joi.string()
            })
        }),
        result: joi.any()
    })
});
