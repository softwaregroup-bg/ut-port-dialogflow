const joi = require('joi');
module.exports = joi.object().keys({
    name: joi.string(),
    id: joi.string(),
    lifespanCount: joi.number().default(1),
    parameters: joi.object().default({})
}).or('name', 'id');
