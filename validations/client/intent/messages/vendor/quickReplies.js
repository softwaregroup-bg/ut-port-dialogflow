const joi = require('joi');
module.exports = joi.object().keys({
    title: joi.string(),
    quickReplies: joi.array().items(joi.string())
});
