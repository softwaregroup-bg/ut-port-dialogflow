const joi = require('joi');
module.exports = {
    description: 'Get context',
    params: joi.object().keys({
        url: joi.string(),
        method: joi.string().valid('GET'),
        headers: joi.object().keys({
            Authorization: joi.string()
        })
    }),
    result: joi.any()
};
