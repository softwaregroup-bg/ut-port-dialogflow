module.exports = joi => joi.object().keys({
    title: joi.string(),
    quickReplies: joi.array().items(joi.string())
});
