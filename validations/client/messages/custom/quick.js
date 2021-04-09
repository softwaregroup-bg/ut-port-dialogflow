module.exports = joi => joi.object().keys({
    text: joi.string(),
    attachments: joi.array().items(
        joi.alternatives([
            joi.string(),
            joi.object().keys({
                contentType: 'application/x.button',
                title: joi.string(),
                value: joi.string().required()
            })
        ])
    ).min(1),
    details: joi.object().keys({
        title: joi.string()
    })
});
