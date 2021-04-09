module.exports = joi => joi.object().keys({
    text: joi.string(),
    attachments: joi.array().items(
        joi.alternatives([
            joi.string(),
            joi.object().keys({
                contentType: joi.string().allow('image/jpeg', 'image/gif', 'image/png').required(),
                title: joi.string(),
                url: joi.string().required(),
                thumbnail: joi.string()
            })
        ])
    ).min(1)
});
