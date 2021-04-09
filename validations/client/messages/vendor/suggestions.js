module.exports = joi => joi.object().keys({
    suggestions: joi.array().items(joi.object().keys({
        title: joi.string()
    }))
});
