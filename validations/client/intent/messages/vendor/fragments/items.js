const joi = require('joi');
const image = require('./image');
module.exports = joi.array().items(joi.object().keys({
    info: joi.object().keys({
        key: joi.string(),
        synonyms: joi.array().items(joi.string())
    }),
    title: joi.string(),
    description: joi.string(),
    image
}));
