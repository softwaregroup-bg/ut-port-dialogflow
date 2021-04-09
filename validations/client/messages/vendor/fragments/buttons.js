module.exports = joi => joi.array().items(joi.object().keys({
    text: joi.string(),
    postback: joi.string()
}));
