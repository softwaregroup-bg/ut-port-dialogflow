const joi = require('joi');
module.exports = joi.array().items(joi.object().keys({
    text: joi.string(),
    postback: joi.string()
}));
