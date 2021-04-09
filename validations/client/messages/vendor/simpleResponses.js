module.exports = joi => joi.object().keys({
    simpleResponses: joi.array().items(joi.object().keys({
        textToSpeech: joi.string(),
        ssml: joi.string(),
        displayText: joi.string()
    }))
});
