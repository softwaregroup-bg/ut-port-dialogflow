const joi = require('joi');
module.exports = joi.object().keys({
    text: joi.array().items(joi.string())
});
