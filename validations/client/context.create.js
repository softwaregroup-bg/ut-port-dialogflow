// @ts-check
/** @type { import("./validation").validation } */
module.exports = joi => {
    const context = require('./context')(joi);
    return {
        'context.create': () => ({
            description: 'Create context',
            params: joi.object().keys({
                url: joi.string(),
                body: context,
                headers: joi.object().keys({
                    Authorization: joi.string()
                })
            }),
            result: context
        })
    };
};
