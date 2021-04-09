module.exports = joi => joi.object().keys({
    text: joi.array().items(joi.string())
});
