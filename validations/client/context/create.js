const joi = require('joi');
const context = require('./partials/context');
module.exports = {
    description: 'Create context',
    params: joi.object().keys({
        url: joi.string(),
        body: context,
        headers: joi.object().keys({
            Authorization: joi.string()
        })
    }),
    result: context
};
