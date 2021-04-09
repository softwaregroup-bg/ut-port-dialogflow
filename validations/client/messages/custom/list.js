module.exports = joi => joi.object().keys({
    text: joi.string(),
    attachments: joi.array().items(joi.object().keys({
        contentType: joi.string().allow('application/x.button').required(),
        title: joi.string(),
        value: joi.string(),
        url: joi.string().uri(),
        thumbnail: joi.string().uri(),
        details: joi.object().keys({
            subtitle: joi.string(),
            actions: joi.array().items(joi.object().keys({
                title: joi.string(),
                url: joi.string().uri()
            }))
        })
    })).min(1)
});
