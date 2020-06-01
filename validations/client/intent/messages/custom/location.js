const joi = require('joi');
module.exports = joi.object().keys({
    text: joi.string(),
    attachments: joi.array().items(joi.object().keys({
        contentType: joi.string().allow('application/x.location').required(),
        title: joi.string(),
        url: joi.string().required(),
        thumbnail: joi.string(),
        details: joi.object().keys({
            lat: joi.number(),
            lon: joi.number(),
            address: joi.string()
        })
    })).min(1)
});
