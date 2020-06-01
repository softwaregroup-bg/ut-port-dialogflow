const joi = require('joi');
module.exports = joi.object().keys({
    suggestions: joi.array().items(joi.object().keys({
        title: joi.string()
    }))
});
