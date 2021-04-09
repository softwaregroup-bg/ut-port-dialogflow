// @ts-check
/** @type { import("./validation").validation } */
module.exports = joi => {
    const context = require('./context')(joi);
    return {
        'context.patch': () => ({
            description: 'Patch context',
            params: joi.object().keys({
                url: joi.string(),
                method: joi.string().valid('PATCH'),
                qs: joi.object().keys({
                    updateMask: joi.string().optional()
                }),
                body: context,
                headers: joi.object().keys({
                    Authorization: joi.string()
                })
            }),
            result: joi.any()
        })
    };
};
