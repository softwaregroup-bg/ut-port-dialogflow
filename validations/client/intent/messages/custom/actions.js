const joi = require('joi');
module.exports = joi.object().keys({
    text: joi.string(),
    attachments: joi.array().items(
        joi.alternatives([
            joi.string(),
            joi.object().keys({
                contentType: joi.string().allow('application/x.button').required(),
                title: joi.string(),
                value: joi.string(),
                url: joi.string().uri(),
                thumbnail: joi.string().uri(),
                details: joi.object().keys({
                    type: joi.string().valid(['url', 'reply', 'post'])
                })
            })
        ])
    ).min(1),
    details: joi.object().keys({
        title: joi.string()
    })
});
